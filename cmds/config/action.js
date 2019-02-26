const chalk = require('chalk');
const Table = require('cli-table');
const conf = require('../../lib/conf-store');

module.exports = function(subcmd, args) {
  if (!subcmd) subcmd = 'list'
  if (subcmd && ['list', 'get', 'set', 'delete'].includes(subcmd)) {
    if (subcmd === 'get') subcmd = 'getAction'
    conf[subcmd](args)
  }
  process.exit(0);
};
