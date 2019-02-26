const action = require('./action')

module.exports = {
  command: 'tpl <subcmd> [name] [url]',
  usage: '<cmd> [tpl-name] [url]', // 用法信息
  description: '增删自定义模板',
  action
}
