const co = require('co')
const prompt = require('co-prompt')
const config = require('../template')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')


module.exports = () => {
  co(function* () {
    let tplName = yield prompt('template name: ')
    if (config.tpl[tplName]) {
      return
    }
    let tplUrl = yield prompt('github https url: ')
    let branch = yield prompt('git branch: ')
    config.tpl[tplName] = {}
    config.tpl[tplName].url = tplUrl
    config.tpl[tplName].branch = branch

    // 写入模板文件
    fs.writeFile(path.join(__dirname, '../template.json'), JSON.stringify(config), err=>{
      if (err) console.log(err)
      console.log(chalk.green('New template added!\n'))
      console.log(chalk.green('The last template list is: \n'))
      let showRel = config.tpl[tplName]
      showRel.name = tplName
      console.log(JSON.stringify(config.tpl[tplName], null, '  '))
      process.exit(0)
    })
  })
}