#!/usr/bin/env node

const cli = require('commander');
const path = require('path');
const glob = require('glob');

const options = {
  realpath: true,
  cwd: path.resolve(__dirname, './lib'),
};

glob
  .sync('*/index.js', options)
  .map(require)
  .forEach(fn => fn(cli));

cli.version('0.0.4-alpha');
cli.parse(process.argv);

if (!cli.args.length) cli.help();
