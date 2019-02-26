const printExampleHelp = require('./help')
const open = require('opn')

module.exports = {
  command: 'wiki',
  description: '查看 lime framework wiki',
  help: printExampleHelp,
  action() {
    open('https://github.io/limefe/lime-tpl-standard')
    process.exit(0)
  }
}
