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
    console.log(chalk.green('----------- ❤️ 青檬前端 倾心打造❤️ -----------'));
    console.log(chalk.green('----------- https://github.com/limefe -----------\n'))
  }
}