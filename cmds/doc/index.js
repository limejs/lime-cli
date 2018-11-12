const printExampleHelp = require('./help')
const open = require('opn')

module.exports = {
  command: 'doc',
  description: '查看lime框架帮助文档',
  help: printExampleHelp,
  action() {
    open('https://github.io/limefe/lime')
  }
}