const action = require('./action')

module.exports = {
  command: 'list',
  description: '列出所有可用的模板',
  action() {
    return action(true)
  },
  options: [
    ['-o --offline', '离线列表(不查询网络 只展示本地缓存的列表)']
  ],
  help: () => {
    console.log('\nExamples:');
    console.log('');
    console.log('  $ lime list')
    console.log();
  }
}
