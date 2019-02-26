const action = require('./action')

module.exports = {
  command: 'list',
  description: '列出所有可用的模板',
  action() {
    return action(true)
  },
  help: () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ lime list -l')
    console.log();
  }
}
