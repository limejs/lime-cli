const co = require('co')
const prompt = require('co-prompt')
const config = require('../template').tpl
const exec = require('child_process').exec
const chalk = require('chalk')

module.exports = function () {
  co(function* () {
    let tplName = yield prompt('Please input the template name\n')
    let projectName = yield prompt('Please input your project name\n')

    if (!config[tplName]) {
      console.log('Sorry, there is not a template named: ' + tplName)
      process.exit(0)
    }

    // 下载
    let repoUrl = config[tplName].url
    let branch = config[tplName].branch
    let cmdStr = `git clone ${repoUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`
    console.log(chalk.white('\n Start generating...'))
    exec(cmdStr, (err, stdout, stderr)=>{
      if (err) {
        console.log(chalk.red(err.message))
        process.exit(0)
      }
      console.log(chalk.green('\n √ Generation completed!'))
      console.log(`\n you can: cd ${projectName} , and begin your developing \n`)
      process.exit(0)
    })
  })
}