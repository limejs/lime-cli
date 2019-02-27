const utils = require('../../lib/util')
const fs = require('fs')
const readMeta = require('read-metadata')
const home = require('user-home')
const logger = require('../../lib/logger')
const path = require('path')
const nodeUtil = require('util')
const Table = require('cli-table')

module.exports = async function (subcmd, name, url) {
  const userTemplatesPaths = path.join(home, '.lime-cli/user-templates.json')
  if (!fs.existsSync(userTemplatesPaths)) {
    fs.mkdirSync(path.dirname(userTemplatesPaths), {
      recursive: true
    })
    fs.writeFileSync(userTemplatesPaths, JSON.stringify([]))
  }
  if (subcmd === 'add') {
    if(!name || !url) {
      logger.fatal('必须填写模板名称和url，URL可以是github仓库短名称')
      return
    }
    let userTplLists = await nodeUtil.promisify(readMeta)(userTemplatesPaths)
    let index = userTplLists.findIndex(item => {
      item.name === name
    })
    if (index > -1) {
      userTplLists.splice(index, 1, {
        name: name,
        url: url,
        desc: name,
        fullName: name
      })
    }
    else {
      userTplLists.push({
        name: name,
        url: url,
        desc: name,
        fullName: name
      })
    }
    fs.writeFileSync(userTemplatesPaths, JSON.stringify(userTplLists, null, 2))
    logger.success('模板添加成功')
    // 打印所有模板
    let table = new Table({
      head: ['name', 'url']
    });
    userTplLists.forEach(tpl => {
      table.push([tpl.name, tpl.url])
    })
    console.log(table.toString());
  }
  if (subcmd === 'del') {
    if(!name) {
      logger.fatal('必须填写要删除的模板名称')
    }
    let userTplLists = await nodeUtil.promisify(readMeta)(userTemplatesPaths)
    let index = userTplLists.findIndex(item => {
      item.name === name
    })
    if (index) {
      userTplLists.splice(index, 1)
    }
    fs.writeFileSync(userTemplatesPaths, JSON.stringify(userTplLists, null, 2))
    logger.success('模板删除成功')
  }
}
