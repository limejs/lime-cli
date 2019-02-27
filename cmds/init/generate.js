const path = require('path')
const fs = require('fs')
const download = require('./download')
const readMeta = require('read-metadata')
const utils = require('./utils')
const Handlebars = require('handlebars')
const Metalsmith = require('metalsmith')
const logger = require('../../lib/logger')
const { askQuestions, filterFiles, renderTemplateFiles } = require('./generate-plugins')
const chalk = require('chalk')
const boxen = require('boxen')

/**
 * @params {String}folderName 用户输入的项目目录名
 * @params {String}projectDir 计算而来的项目创建绝对路径
 * @params {String}templateName 用户选择或输入的模板名称
 */
module.exports = async function generate(folderName, projectDir, templateName) {
  // 初始化 templateName, 本地模板名(如./xxx/xxx)则转为绝对路径，远程模板名(basic或aaa/bbb这样的githubname)，则取下载下来并拿到绝对路径
  let finalTemplatePath = ''

  if (/^[./]|(^[a-zA-Z]:)/.test(templateName)) {
    // 本地模板(C:/xx 或 /usr/local/xx)。 相对路径转为绝对路径
    finalTemplatePath = path.isAbsolute(templateName) ? templateName : path.normalize(path.join(process.cwd(), templateName))
    if (!fs.existsSync(finalTemplatePath)) {
      logger.fatal('模板%s不存在', finalTemplatePath)
    }
  } else {
    // 远程模板逻辑
    if (!templateName.indexOf('/') > -1) {
      // 官方模板
      const officialTemplate = 'limejs/' + templateName
      finalTemplatePath = await download(officialTemplate)
    } else {
      // 第三方模板
      finalTemplatePath = await download(templateName)
    }
  }


  // 用 finalTemplatePath 模板 生成项目
  let metaInfo = utils.getMetaData(finalTemplatePath) // 从模板文件夹里拿出meta json信息
  // 设置 meta.prompt提问的default（因为有些信息 模板编写者撰写meta.js时是不知道的）
  utils.setDefault(metaInfo, 'name', folderName)
  utils.setDefault(metaInfo, 'author', utils.getGitUser())
  
  // 注册 handlebars helper
  utils.registerTplHelper(Handlebars, metaInfo)

  // 
  // 用 metalsmith 生成静态文件
  const tplFilesPath = path.join(finalTemplatePath, 'template')
  if (!fs.existsSync(tplFilesPath)) {
    console.log()
    logger.fatal('模板缺少必须的 template 文件夹，请检查')
    return
  }
  const metalsmith = new Metalsmith(tplFilesPath)
  // 把几个变量放到 metalsmith全局meta (所有模板可用)
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: folderName,
    inPlace: projectDir === process.cwd(),
    noEscape: true
  })

  const helpers = { chalk, logger }
  // metalsmith before 钩子
  if (metaInfo.metalsmith && typeof metaInfo.metalsmith.before === 'function') {
    metaInfo.metalsmith.before(metalsmith, metaInfo, helpers)
  }

  // metalsmith 插件
  metalsmith
    .use(askQuestions(metaInfo.prompts)) // 提问
    .use(filterFiles(metaInfo.filters)) // 根据问题过滤掉不需要渲染的目录
    .use(renderTemplateFiles(metaInfo.skipInterpolation)) // 渲染

  // metalsmith after 钩子
  if (metaInfo.metalsmith && typeof metaInfo.metalsmith.before === 'function') {
    metaInfo.metalsmith.after(metalsmith, metaInfo, helpers)
  }

  metalsmith.clean(false)
    .source('.') // 改变metalsmith默认工作目录
    .destination(projectDir)
    .build((err, files) => {
      if (err) {
        logger.fatal(err)
      }
      // 编译完成的回调
      if (typeof metaInfo.complete === 'function') {
        const helpers = { chalk, logger, files }
        console.log()
        metaInfo.complete(data, helpers)
        console.log()
      } else {
        console.log()
        logger.success(metaInfo.completeMessage, data)
        console.log()
      }
      // cli 内部打印成功消息
      let msg = `
        ✔ 项目初始化成功

        请按照下面的步骤进行操作：
        `;
        !data.inPlace && (msg += `
          > cd ${folderName}`)
        msg +=`
          > npm install 安装项目依赖
          > npm run dev 开启后端服务
        `
        console.log(boxen(msg, {
            padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
            },
            margin: 0,
            borderColor: 'green',
            borderStyle: 'classic'
        }))
    })
}
