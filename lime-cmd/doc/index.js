
const open = require('opn')

module.exports = {
  command: 'doc2',
  description: '查看lime2框架帮助文档',
  action() {
    open('https://cuiyongjian.com')
  }
}