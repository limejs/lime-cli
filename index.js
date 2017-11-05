var commander = require('commander')

commander.version(require('./package.json'))

commander.usage('<command>')

commander.command('add').description('add new template')
.alias('a').action(() => {
  console.log('hi')
  require('./lib/add')()
})

commander.command('list').description('list all the template')
.alias('l').action(() => {
  require('./lib/list')
})

commander.command('init').description('init a new project')
.alias('i').action(()=>{
  require('./lib/init')
})

commander.command('delete').description('delete a template')
.alias('d').action(()=>{
  require('./lib/delete')
})

commander.parse(process.argv)

if (process.argv.length <= 2) {
  commander.help()
}