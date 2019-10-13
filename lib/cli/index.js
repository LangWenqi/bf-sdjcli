#!/usr/bin/env node

'use strict';

const program = require('commander');

const packageInfo = require('../../package.json');


program
    .version(packageInfo.version)

program
    .command('init [template] [dirName]') // bf init
    .description('生成一个项目')
    .alias('i') // 简写
    .action((template, dirName) => {
      require('../cmd/init')(template, dirName);
    });

program
    .command('add') // bf add
    .description('添加新模板')
    .alias('a') // 简写
    .action(() => {
      require('../cmd/add')();
    });

program
    .command('list') // bf list
    .description('查看模板列表')
    .alias('l') // 简写
    .action(() => {
      require('../cmd/list')();
    });

program
    .command('delete') // bf delete
    .description('删除模板')
    .alias('d') // 简写
    .action(() => {
      require('../cmd/delete')();
    });

program.parse(process.argv);

if(!program.args.length){
  program.help()
}
