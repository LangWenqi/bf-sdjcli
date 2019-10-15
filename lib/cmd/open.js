'use strict'
const fs = require('fs');
const exec = require('child_process').exec;
const table = require('../table');
const tip = require('../tip');
const tpls = require('../../templates');

const writeFile = (err) => {
  // 处理错误
  if (err) {
    console.log(err);
    tip.fail('请重新运行!');
    process.exit();
  }

  table(tpls);
  tip.suc('新模板添加成功!');
};

const resolve = (tpls) => {
  // 把模板信息写入templates.json
  fs.writeFile(__dirname + '/../../templates.json', tpls, 'utf-8', writeFile);
};


module.exports = (path) => {
  fs.readFile(path, "utf-8", function(error, data) {
		if (error) return console.log("读取文件失败,内容是" + error.message);
		resolve(data);
	});
}
