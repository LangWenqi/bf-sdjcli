'use strict'
const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs');

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
  process.exit();
};

const resolve = (result) => {
  const { tplName, gitUrl, branch, description, } = result;
  // 避免重复添加
  if (!tpls[tplName]) {
    tpls[tplName] = {};
    tpls[tplName]['url'] = gitUrl.replace(/[\u0000-\u0019]/g, ''); // 过滤unicode字符
    tpls[tplName]['branch'] = branch;
    tpls[tplName]['description'] = description;
  } else {
    tip.fail('模板已经存在!');
    process.exit();
  };

  // 把模板信息写入templates.json
  fs.writeFile(__dirname + '/../../templates.json', JSON.stringify(tpls), 'utf-8', writeFile);
};
const inputCallBack = function *(promptName) {
	const proName = yield prompt(promptName);
	if (!proName){
		return yield inputCallBack(promptName);
	} else {
		return proName
	} 
}

module.exports = () => {
  co(function *() {
    // 分步接收用户输入的参数
		const tplName = yield inputCallBack('模板名字: ');
    const gitUrl = yield inputCallBack('Git https 链接: ');
    let options = yield prompt('Git options:（格式如下：master,dev） ');
		if (!options) {
			options = 'master'
		}
    let description = yield prompt('模板描述: ');
		if (!description) {
			description = tplName
		}
    return new Promise((resolve, reject) => {
      resolve({
        tplName,
        gitUrl,
        options,
        description,
      });
    });
  }).then(resolve);
}
