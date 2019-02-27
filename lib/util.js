const fs = require('fs')
const chalk = require('chalk')

module.exports = {
  // lime-cli 根目录
  getLimeCliPath() {
    return path.resolve(__dirname, '..')
  },
  // web项目根目录
  getProjectRootPath() {
    return process.cwd()
  },
  // 打印logo
  printLogo(logoFileName) {
    let logoText = fs.readFileSync(logoFileName);
    console.log(chalk.magenta(logoText));
    console.log(chalk.green('----------- ❤️ LIME.JS FOR YOU❤️ -----------'));
    console.log(chalk.green('----------- https://github.com/limejs -----------\n'))
  },
  // 打印错误提示信息
  printError(msg) {
    console.log(chalk.red('  error: ' + msg))
  },
  // 填充字符(不超过20)
  padRight(str, num, char) {
    let i = 0, len = str.length
    while(i++ <= (num-len)) {
      str += char
    }
    return str
  },
  getWidth(arr) {
    let len = 0
    arr.forEach(item => {
      item.length > len && (len = item.length)
    })
    return len
  }
}
