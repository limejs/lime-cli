const action = require('./action');

module.exports = {
    command: 'config [subcmd] [args]', // 模拟子命令
    description: '配置信息查看、编辑',
    // options: [
    //     ['-l, --list', '显示全部配置信息'],
    //     ['-g --get', '获取配置信息'],
    //     ['-s, --set', '设置配置信息'],
    //     ['-d --delete', '删除配置信息']
    // ],
    action: action,
    help: () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ lime config list');
        console.log('    $ lime config');
        console.log('    $ lime config set EXTRA_PLUGINS=/path/to/extra_plugins_dir');
        console.log('    $ lime config get a')
        console.log();
    }
};
