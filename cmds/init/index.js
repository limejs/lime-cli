const help = require('./help')
const action = require('./action')

module.exports = {
  command: 'init <dir>',
  alias: ['create <dir>'],
  usage: '[project-name]', // 用法信息
  description: '初始化lime项目',
  action,
  help
}
