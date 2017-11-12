const co = require('co')
const prompt = require('co-prompt')
const config = require('../template')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')


module.exports = (tplNames) => {
  co(function* () {
    if (tplNames.length < 1) {
      let tplId = yield prompt('Which template do you want to delete?\n')
      tplNames = [tplId]
    }

    let waitDeleteIds = []
    tplNames.forEach(tplId => {
      if (config.tpl[tplId]) {
        delete config.tpl[tplId]
        waitDeleteIds.push(tplId)
      }
      else {
        console.log(chalk.red('This template is not exist!'))
      }
    })

    if (waitDeleteIds.length == 0) {process.exit(0)}
    
    fs.writeFile(path.join(__dirname, '../template.json'), JSON.stringify(config, null, '  '), (err)=>{
      if (err) {
        console.log(chalk.red('删除失败'))
        process.exit(0)
      }
      console.log(chalk.green(`模板 ${waitDeleteIds} 删除成功!`))
      // console.log(JSON.stringify(config, null, '  '))
      process.exit(0)
    })



  })
}