const util = require('../../lib/util')
const nodeUtil = require('util')
const debug = require('debug')('lime:init:action')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const home = require('user-home')
const config = require('../../lib/conf-store')
const updateTemplates = require('../list/action')
const logger = require('../../lib/logger')
const generate = require('./generate')
const readMeta = require('read-metadata')

const limeUserDir = path.join(home, '.lime-cli')

module.exports = async function(folderName, cmd) {
  // if (!Object.keys(templates).includes(templateName)) {
  //   util.printError(`模板 { ${templateName} } 不存在`)
  //   cmd.outputHelp()
  //   process.exit(1)
  // }
  // 装逼式写法
  let inPlace = !folderName || folderName === '.' // 是否创建在当前目录
  inPlace && (folderName = path.relative('../', process.cwd())) // 当前目录的名字。小api技巧获取当前目录的名字
  let projectDir = inPlace ? process.cwd() : path.resolve(folderName) // 项目要创建的目标目录位置

  // 判断项目名是否已经存在, 风险提示
  if (fs.existsSync(projectDir)) {
    let files = fs.readdirSync(projectDir)
    if (files.length) {
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'override',
          message: inPlace ? '当前目录不为空，确定要在当前目录初始化吗?' : `目标目录${folderName}不为空，确认要覆盖该目录吗?`,
          default: false
        }
      ]).then(anwsers => {
        if (anwsers.override) {
          continueInit()
        }
      })
    }
  }
  else {
    continueInit()
  }

  // 风险提示过后，开始初始化流程
  async function continueInit() {
    // 判断项目模板关键列表文件 ~/.lime-cli/templates.json，没有则触发 lime list行为去 下载最新模板
    let tplLists = null
    try {
      officeTpl = await nodeUtil.promisify(readMeta)(path.join(limeUserDir, 'templates.json'))
      userTpl = await nodeUtil.promisify(readMeta)(path.join(limeUserDir, 'user-templates.json'))
      tplLists = officeTpl.concat(userTpl)
      if (!tplLists || !Array.isArray(tplLists)) throw new Error('空的模板列表') // 模板配置解析失败
    }
    catch(err) {
      if(!(err.message.indexOf('user-templates.json') > -1)) {
        logger.fatal(err)
      }
      // 模板列表读不到或解析失败
      tplLists = await updateTemplates()
      if (!fs.existsSync(limeUserDir)) fs.mkdirSync(limeUserDir, {
        recursive: true
      })
      fs.writeFileSync(path.join(limeUserDir, 'templates.json'), JSON.stringify(tplLists, null, 2))
    }

    // 让用户选择一个模板
    let prompt = [
      {
        type: 'list',
        name: 'templateName',
        message: '请选择一个项目模板',
        default: 0,
        choices: tplLists.map(tpl => {
          return {
            name: tpl.desc || tpl.name, // 看到的
            value: tpl.name,
          }
        })
      }
    ]
    let answers = await inquirer.prompt(prompt)

    if (!tplLists.some(tpl => tpl.name === answers.templateName)) {
      util.printError(`模板 { ${answers.templateName} } 不存在`)
      process.exit(1)
    }
    
    // folderName: 项目创建位置的目录文件夹名称，projectDir 项目输出位置的绝对路径； templateName: 用户选定或输入的模板名；inPlace是否是在当前所在目录。
    // 生成项目
    await generate(folderName, projectDir, answers.templateName)

    // let msg = `
    // ✔ 项目初始化成功

    // 请按照下面的步骤进行操作：
    //     1. cd ${folderName}
    //     2. npm install 安装项目依赖
    //     3. npm run dev 开启后端服务
    // `;
    // console.log(boxen(msg, {
    //     padding: {
    //         left: 0,
    //         right: 4,
    //         top: 0,
    //         bottom: 0
    //     },
    //     margin: 0,
    //     borderColor: 'green',
    //     borderStyle: 'classic'
    // }))
  }
}

