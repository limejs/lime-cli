const fs = require('fs')
const utils = require('util')
const home = require('user-home')
const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')
const logger = require('../../lib/logger')
const rm = require('rimraf').sync
const limeTplUserDir = path.join(home, '.lime-cli/templates')
const gitUrlParse = require('git-url-parse')

module.exports = downloadTpl;

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

async function downloadTpl(templateName, isClone) {
  // 解析git repo url 解除 fullName
  const parsedUrl = gitUrlParse(templateName)
  templateName = parsedUrl.full_name || templateName
  // 计算模板缓存目标位置 ~/.lime-cli/templates
  const tmpTpl = path.join(limeTplUserDir, templateName.replace(/[\/:]/g, '-'))
  const spinner = ora('downloading template' + ' ' + templateName)
  spinner.start()
  // Remove if local template exists
  if (fs.existsSync(tmpTpl)) rm(tmpTpl)
  try {
    let pdownload = utils.promisify(download)
    await pdownload(templateName, tmpTpl)
  }
  catch(err) {
    console.log()
    console.log()
    logger.fatal('模板下载失败 ' + templateName + ' 原因:' + err.message)
    process.exit(1)
  }
  spinner.stop()
  return tmpTpl
}
