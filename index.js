var commander = require('commander')

commander.version(require('./package.json'))

commander.usage('<command>')

commander.command('add').description('add new template')
.alias('a').action(() => {
  require('./lib/add')()
})

commander.command('list').description('list all the template')
.alias('l').action(() => {
  require('./lib/list')()
})

commander.command('init [tplName]').description('init a new project')
.alias('i').action((tplName)=>{
  require('./lib/init')(tplName)
})

commander.command('delete [tplNames...]').description('delete a template')
.alias('d').action((tplNames)=>{
  // console.log('tplNames: ', tplNames)
  // tplNames.length < 1 && require('./lib/delete')()
  require('./lib/delete')(tplNames)
})

commander.parse(process.argv)

if (process.argv.length <= 2) {
  commander.help()
}