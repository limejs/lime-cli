const chalk = require('chalk');
const Table = require('cli-table');
const conf = require('../../lib/conf-store');
const logger = require('../../lib/logger')

module.exports = function(subcmd, args) {
  if (!subcmd) subcmd = 'list'
  if (subcmd && ['list', 'get', 'set', 'delete'].includes(subcmd)) {
    if (subcmd === 'get') subcmd = 'getAction'
    conf[subcmd](args)
  }
  else {
    logger.fatal('不可用的子命令', subcmd)
  }
  process.exit(0);
};
