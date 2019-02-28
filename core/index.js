const commander = require('commander')
const chalk = require('chalk')
const util = require('../lib/util')
const logger = require('../lib/logger')
let globalCmdOptions = null // 用于保存全局options配置

module.exports = {
  registerGlobalCommand,
  registerCommand,
  start
}

// 注册全局命令配置
function registerGlobalCommand(options) {
  if (!options) { return }
  globalCmdOptions = options
  let cmd = commander.version(options.version)
  cmd.usage(options.usage)
  cmd.description(options.description || '')
  // cmd.description(options.description)
  cmd.on('--help', options.help || (() => {}))
  _iterateOption(options.options, cmd)
}

// 注册子命令
function registerCommand(options) {
  // 必填: command, action
  if (!options || !options.command || ! options.action) {
    throw new Error(`options缺少或缺失必填的 command(${options.command}), action${options.action} 字段`)
  }
  let i = -1;
  do{
    // console.log((options.alias && options.alias.length >0 && i>=0)?options.alias[i] : options.command);
    let cmd = commander.command((options.alias && options.alias.length >0 && i>=0)?options.alias[i] : options.command)
    cmd.usage(options.usage)
    cmd.description(options.description)
    cmd.on('--help', options.help || (() => {}))
    // 遍历 options
    _iterateOption(options.options, cmd)
    cmd.action((...args) => {
      options.action(...args)
    })
    i++
  }while(options.alias && options.alias.length >0 && i<options.alias.length)
}

// 启动 commander 
function start() {
  // 监听子命令输入错误（这个会同步执行，所以捕获之后走不到下面的globalAction
  commander
    .on('command:*', (commandName) => {
      logger.fatal(`命令 ${commander.args.join(' ')} 不存在！`)
      commander.outputHelp() // 触发打印帮助信息
      // util.printLogo(path.resolve(__dirname, 'logo')) // 再打印logo
      process.exit(1);
    })
  commander.parse(process.argv)
  // 若有全局cmd配置，则在parse后需执行一下全局的action （因为全局action只能等parse之后来手工执行）
  if (globalCmdOptions && globalCmdOptions.action) {
    globalCmdOptions.action(commander)
  }
}



function _iterateOption(options, cmd) {
  if (!options || !Array.isArray(options)) {
    return
  }
  options.forEach(option => {
    cmd.option(option[0], option[1])
  })
}
