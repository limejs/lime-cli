const co = require('co')
const prompt = require('co-prompt')
const config = require('../template')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')


module.exports = () => {
  co(function* () {
    let tplName = yield prompt('请输入要添加的模板的名称(请使用英文字母): ')
    if (config.tpl[tplName]) {
      console.log(chalk.red('模板已存在，请换一个名字!'))
      process.exit(0)
    }
    let tplUrl = yield prompt('请输入模板所在的Github仓库地址: ')
    let branch = yield prompt('请输入要使用的该仓库的分支名称(默认是master分支): ')
    config.tpl[tplName] = {}
    config.tpl[tplName].url = tplUrl
    config.tpl[tplName].branch = branch || 'master'

    // 写入模板文件
    fs.writeFile(path.join(__dirname, '../template.json'), JSON.stringify(config, null, '  '), err=>{
      if (err) console.log(err)
      console.log(chalk.green('成功，一个新的模板已经添加到lime-cli!\n'))
      console.log(chalk.green('您刚刚添加的模板信息如下: \n'))
      let showRel = config.tpl[tplName]
      showRel.name = tplName
      console.log(JSON.stringify(config.tpl[tplName], null, '  '))
      process.exit(0)
    })
  })
}