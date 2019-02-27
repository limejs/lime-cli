const co = require('co')
const prompt = require('co-prompt')
const config = require('../template').tpl
const exec = require('child_process').exec
const chalk = require('chalk')

module.exports = function (tplName) {
  co(function* () {
    if (!tplName) {
      tplName = yield prompt('请输入您要使用的脚手架模板名称: ')
    }
    if (!config[tplName]) {
      console.log(chalk.red('抱歉，模板库中没有这个模板: ' + tplName))
      process.exit(0)
    }

    let projectName = yield prompt('请输入一个项目名称: ')


    // 下载
    let repoUrl = config[tplName].url
    let branch = config[tplName].branch
    let cmdStr = `git clone ${repoUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`
    console.log(chalk.white('\n 开始创建项目...'))
    exec(cmdStr, (err, stdout, stderr)=>{
      if (err) {
        console.log(chalk.red(err.message))
        process.exit(0)
      }
      console.log(chalk.green('\n √ 项目创建成功!'))
      console.log(`\n 你可以执行: cd ${projectName} , 然后开始您的开发 \n`)
      process.exit(0)
    })
  })
}