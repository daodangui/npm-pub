const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');
const ora = require('ora');
const downloadProject = require('./down');
const { npmUser } = require('../config');

const cdProjectRepo = (path, projectName) => {
  const name = projectName || require(`${path}/package.json`).name;
  const spinner = ora(chalk.green(`${name}开始发布...`)).start();

  shell.cd(path);
  if (shell.which('npm')) {
    const registry = shell.exec('npm config get registry');
    if (!registry.stdout.includes('https://fs-npm.tuhu.cn/')) {
      shell.exec('npm config set registry https://fs-npm.tuhu.cn/');
    }
    shell.exec('npm whoami', {
      silent: true
    }, (code, stdout, stderr) => {
      if (!stderr) {
        if (stdout.trim() === npmUser.user) {
          shell.exec('npm publish', { silent: true },  (code, stdout, stderr) => {
            if (stdout) {
              spinner.succeed(chalk.green(`${stdout}发布成功！`));
            } else {
              spinner.fail(chalk.red(stderr));
            }
          });
        }
      } else {
        spinner.fail(chalk.red(`${name}发布失败`));
      }
    });
  }
}

const publish = (address, branch) => {
  if (path.isAbsolute(address)) {
    cdProjectRepo(address);
  } else {
    downloadProject(address, branch)
      .then((projectName) => {
        const path = `repo/${projectName}`;
        cdProjectRepo(path, projectName);
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  }
}

module.exports = publish;