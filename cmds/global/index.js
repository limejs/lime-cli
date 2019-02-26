const util = require('../../lib/util')
const path = require('path')

module.exports = {
  version: require('../../package.json').version,
  usage: '<command> [options]',
  // description: 'lime-cli 是与lime框架配套的项目管理工具',
  help() {
    console.log('') // 打印空行，让全局的默认help信息底部加一个空行
  },
  // 全局action （实际上commander没有这个全局action概念，此处是为了统一写法）
  action(commander) {
    // -v 参数的处理
    if (commander.vision) {
      console.log(this.version)
      return
    }
    if (commander.args.length === 0) {
      commander.outputHelp() // 在用户没有输入任何参数或子命令时，先触发打印帮助信息
      util.printLogo(path.resolve(__dirname, 'logo')) // 再打印logo
    }
  }
}
