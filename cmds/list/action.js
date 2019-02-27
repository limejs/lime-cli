const logger = require('../../lib/logger')
let request = require('request')
const chalk = require('chalk')
const ora = require('ora')
const fs = require('fs')
const home = require('user-home')
const path = require('path')
const readMeta = require('read-metadata')
const { promisify } = require('util')
const utils = require('../../lib/util')
const nodeUtil = require('util')
request = nodeUtil.promisify(request)

const limeUserDir = path.join(home, '.lime-cli')

/**
 * Padding.
 */

console.log()
process.on('exit', () => {
  console.log()
})

/**
 * List repos.
 */
module.exports = async function getLists(isCli) {
  try {
    const spinner = ora('正在查询最新官方模板, 请稍等...\n\n')
    spinner.start()
    let {res, body} = await request({
      url: 'https://api.github.com/users/limejs/repos',
      headers: {
        'User-Agent': 'lime-cli'
      }
    })
    spinner.stop()
    let repos = JSON.parse(body)
    if (Array.isArray(repos)) {
      // 查询官方模板
      let result = repos.filter(repo => repo.name.startsWith('lime-template')).map(repo => {
        return {
          name: repo.name,
          fullName: repo.full_name,
          desc: repo.description,
          url: repo.html_url
        }
      })
      // 查询私有模板
      const userTplLists = []
      try {
        let userTemplatesPath = path.join(home, '.lime-cli/user-templates.json')
        userTplLists = await promisify(readMeta)(userTemplatesPath)
      }
      catch(err) {
      }
      if (isCli) {
        const width = utils.getWidth(result.map(item=>{return {name:item.name.replace(/lime-template-/, '')}}).concat(userTplLists).map(item => item.name))
        console.log('  当前可用官方模板:')
        console.log()
        result.forEach(repo => {
          // CLI 方式调用，则打印可用模板
          console.log(
            '  ' + chalk.yellow('★') +
            '  ' + chalk.blue(utils.padRight(repo.name.replace(/lime-template-/, ''), width, ' ')) +
            (repo.desc ? ` - ${repo.desc}` : ''))
        })
        if (userTplLists && Array.isArray(userTplLists) && userTplLists.length) {
          console.log('\n\n  当前可用私有模板:')
          console.log()
          userTplLists.forEach(repo => {
            // CLI 方式调用，则打印可用模板
            console.log(
              '  ' + chalk.yellow('★') +
              '  ' + chalk.blue(repo.name) +
              (repo.desc ? ` - ${repo.desc}` : ''))
          })
        }
      }
      // 把查询到的官方模板列表写入到用户目录
      if (!fs.existsSync(limeUserDir)) fs.mkdirSync(limeUserDir)
      fs.writeFileSync(path.join(limeUserDir, 'templates.json'), JSON.stringify(result, null, 2))
      return result.concat(userTplLists)
    } else {
      console.log(repos)
      console.error(repos.message)
    }
  }
  catch(err) {
    if (err) logger.fatal(err)
  }
}
