
const commander = require('./core')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('lime:index')
const config = require('./lib/conf-store')

// 注册官方子命令
commander.registerGlobalCommand(require('./cmds/global'))
const innerCmdPath = path.resolve(__dirname, './cmds')
try {
  const files = fs.readdirSync(innerCmdPath)
  files.forEach(file => {
    if (file === 'global') return
    // const state = fs.statSync(path.resolve(innerCmdPath, file))
    let cmdPlugin = require(path.resolve(innerCmdPath, file))
    if (!Object.keys(cmdPlugin).length) return
    commander.registerCommand(cmdPlugin)
  })
}
catch(err) {
  debug('info: ', err.message)
  throw err
}

// 注册用户自定义子命令
const selfCmdDir = config.get('self_cmd_dir') || 'cmds'
const userCmdPath = path.resolve(process.cwd(), selfCmdDir)
try {
  const files = fs.readdirSync(userCmdPath)
  files.forEach(file => {
    // const state = fs.statSync(path.resolve(userCmdPath, file))
    commander.registerCommand(require(path.resolve(userCmdPath, file)))
  })
}
catch(err) {
  debug('info: ', err.message)
}

// 启动 commander
commander.start()
