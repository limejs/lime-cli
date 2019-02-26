// 列出已安装的插件

const help = require('./help')
const action = require('./action')

module.exports = {
  command: 'plugin [subcmd]', // 这里借用一个中括号选填，来把控制权交给自己的action判断（因为尖括号会被commander自动判断缺失）
  usage: '<command> [options]',
  options: [
    ['-p, --pname [v]', '插件的名字']
  ],
  description: 'lime-cli 自定义插件',
  action,
  help
}
