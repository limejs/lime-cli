

const chalk = require('chalk')
const commander = require('commander')

module.exports = (subcmd, cmd) => {
  if (!subcmd || (!['list', 'new'].includes(subcmd))) printHelp(cmd)

  if (subcmd === 'list') {
    console.log('list')
  }
  if (subcmd === 'new') {
    // 获取插件名字
    let pluginName = cmd.pname
    if (!pluginName) printHelp(cmd)
    console.log('new plugin: ', pluginName)
  }
}


function printHelp(cmd) {
  console.log(chalk.red('  plugin 命令输入有误，请检查:'))
  cmd.outputHelp()
  process.exit(0)
}
