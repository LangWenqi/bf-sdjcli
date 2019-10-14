'use strict'
// 操作命令行
const exec = require('child_process').exec;
const co = require('co');
const ora = require('ora');
const prompt = require('co-prompt');

const tip = require('../tip');
const tpls = require('../../templates');

const spinner = ora('正在生成...');

const defaultBranchArr = ['master','dev'];

const execRm = (err, projectName) => {
  spinner.stop();

  if (err) {
    console.log(err);
    tip.fail('请重新运行!');
    process.exit();
  }

  tip.suc('初始化完成！');
  tip.info(`cd ${projectName} && npm install`);
  process.exit();
};

const download = (err, projectName) => {
  if (err) {
    console.log(err);
    tip.fail('请重新运行!');
    process.exit();
  }
  // 删除 git 文件
  exec('cd ' + projectName + ' && rm -rf .git', (err, out) => {
    execRm(err, projectName);
  });
}

const resolve = (result) => {
  const { tplName, url, branch, projectName, } = result;
  // git命令，远程拉取项目并自定义项目名
  const cmdStr = `git clone ${url} ${projectName} && cd ${projectName} && git checkout ${branch}`;

  spinner.start();

  exec(cmdStr, (err) => {
    download(err, projectName);
  });
};
const inputCallBack = function *(promptName) {
	const proName = yield prompt(promptName);
	if (!proName){
		return yield inputCallBack(promptName);
	} else {
		return proName
	} 
}
module.exports = (template, dirName) => {
 co(function *() {
    // 处理用户输入
		let tplName = '';
		if (template) {
			tplName = template;
		} else {
			tplName = yield inputCallBack('模板名字: ');
		}
		let projectName = '';
		if (dirName) {
			projectName = dirName
		} else {
			projectName = yield inputCallBack('项目名字: ');
		}
    if (!tpls[tplName]) {
      tip.fail('模板不存在!');
      process.exit();
    }
		const selectOptions = tpls[tplName].options.split(',');
		let branchArr = [];
		for (const selectOptionItem of selectOptions) {
			let branch = '';
			console.log(defaultBranchArr,selectOptionItem)
			if (defaultBranchArr.indexOf(selectOptionItem) > -1) {
				branch = selectOptionItem;
			} else {
				branch = yield prompt.confirm(`是否使用${selectOptionItem}（yes）`); 
			}
			if (branch) {
				branchArr.push(selectOptionItem);
			}
		}
		tpls[tplName].branch = branchArr.join('_');
    return new Promise((resolve, reject) => {
      resolve({
        tplName,
        projectName,
        ...tpls[tplName],
      });
    });
  }).then(resolve);
}
