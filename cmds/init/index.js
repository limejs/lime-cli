const help = require('./help')
const action = require('./action')

module.exports = {
  command: 'init [project-name]',
  usage: '[project-name]',
  description: '初始化lime项目',
  action,
  help
}