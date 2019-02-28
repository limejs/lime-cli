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
const config = require('../../lib/conf-store')

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
  let officeTplLists = []

  const apiUrl = config.get('list_url') || 'https://api.github.com/users/limejs/repos'
  const spinner = ora('正在查询最新官方模板, 请稍等...\n\n')
  try {
    spinner.start()
    // 获取官方模板api地址 (可以通过 lime config set list_url 修改为内网仓库账号，从而检索出上面的 lime-template- 的模板项目)
    let {res, body} = await request({
      url: apiUrl,
      headers: {
        'User-Agent': 'lime-cli'
      }
    })
    spinner.stop()
    let repos = JSON.parse(body)
    if (Array.isArray(repos)) {
      // 查询官方模板
      officeTplLists = repos.filter(repo => repo.name.startsWith('lime-template')).map(repo => {
        return {
          name: repo.name,
          desc: repo.description,
          url: repo.html_url
        }
      })
    } else {
      logger.fatal(repos.message)
    }
  }
  catch(err) {
    spinner.stop()
    if (err) logger.fatal(err)
  }

  // 查询私有模板
  let userTplLists = []
  try {
    let userTemplatesPath = path.join(home, '.lime-cli/user-templates.json')
    userTplLists = await promisify(readMeta)(userTemplatesPath)
  }
  catch(err) {
    if (!err.code === 'ENOENT') {
      logger.fatal('私有模板读取出错', err)
    }
  }
  

  // 把查询到的官方模板列表写入到用户目录
  let isOffline = false
  if (!officeTplLists || officeTplLists.length < 1) {
    isOffline = true // 可能是网络不好
    // 生成 4个 官方兜底模板
    officeTplLists = ([
      {
        name: '基础', url: 'https://github.com/limejs/lime-template-basic', desc: 'lime mvc基础样板'
      },
      {
        name: 'API', url: 'https://github.com/limejs/lime-template-api', desc: 'lime rest api 样板'
      },
      {
        name: 'SSR', url: 'https://github.com/limejs/lime-template-ssr', desc: 'lime+vue+ssr 样板'
      },
      {
        name: 'SPA', url: 'https://github.com/limejs/lime-template-spa', desc: 'lime+vue 样板'
      }
    ])
  }

  if (!fs.existsSync(limeUserDir)) fs.mkdirSync(limeUserDir)
  fs.writeFileSync(path.join(limeUserDir, 'templates.json'), JSON.stringify(officeTplLists, null, 2))

  if (isCli) {
    if (officeTplLists && officeTplLists.length) {
      const width = utils.getWidth(officeTplLists.map(item=>{return {name:item.name.replace(/lime-template-/, '')}}).concat(userTplLists).map(item => item.name))
      console.log(`  当前可用官方模板${isOffline ? '[离线]' : ''}:`)
      console.log()
      officeTplLists.forEach(repo => {
        // CLI 方式调用，则打印可用模板
        console.log(
          '  ' + chalk.yellow('★') +
          '  ' + chalk.blue(utils.padRight(repo.name.replace(/lime-template-/, ''), width, ' ')) +
          (repo.desc ? ` - ${repo.desc}` : ''))
      })
    }
    else {
      console.log('  当前可用官方模板: 无')
      console.log('  官方模板来源地址: ' + apiUrl)
    }
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
  else {
    return officeTplLists.concat(userTplLists)
  }
}
