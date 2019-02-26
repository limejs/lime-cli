
const open = require('opn')

module.exports = {
  command: 'wiki',
  usage: '输入 lime wiki',
  description: '查看 lime framework wiki',
  action() {
    open('https://github.io/limefe/lime-tpl-standard')
    process.exit(0)
  }
}
