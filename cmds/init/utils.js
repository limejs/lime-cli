const metadata = require('read-metadata')
const exec = require('child_process').execSync
const path = require('path')
const fs = require('fs')

exports.getMetaData = function(dir) {
    const json = path.join(dir, 'meta.json')
    const js = path.join(dir, 'meta.js')
    let opts = {}
  
    if (fs.existsSync(json)) {
      opts = metadata.sync(json)
    } else if (fs.existsSync(js)) {
      const req = require(path.resolve(js))
      if (req !== Object(req)) {
        throw new Error('meta.js needs to expose an object')
      }
      opts = req
    }
  
    return opts
}

// 设置 prompts 提问的默认值
exports.setDefault = function(opts, key, value) {
  const prompts = opts.prompts || (opts.prompts = {})
  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': value
    }
  } else {
    prompts[key]['default'] = value
  }
}


exports.getGitUser = function() {
  let name
  let email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')
  return (name || '') + (email || '')
}

// 注册 handlerbars helper
exports.registerTplHelper = function(Handlebars, metaInfo) {
  // 内置的
  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
      ? opts.fn(this)
      : opts.inverse(this)
  })

  Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b
      ? opts.inverse(this)
      : opts.fn(this)
  })
  // 模板定义的
  metaInfo.helper && Object.keys(metaInfo.helper).forEach(k => {
    Handlebars.registerHelper(k, metaInfo.helper[k])
  })
}
