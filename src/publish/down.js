const ora = require('ora');
const downGitRepo = require('download-git-repo');
const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');

const downloadProject = async (address, branch) => {
  const res = await new Promise((resolve, reject) => {
    const projectName = address.match(/\/(.*)\.git$/)[1];
    const url = address.slice(4, -4);
    const path = `${process.cwd()}/repo/${projectName}`;
    fs.access(path, (err) => {
      if (err) {
        const spinner = ora(`等待clone项目${projectName}...`).start();
        downGitRepo(
          `${url}#${branch}`,
          path,
          { clone: true },
          (err) => {
            if (err) {
              spinner.fail(err);
              reject(err);
            } else {
              spinner.succeed(chalk.green('项目clone成功！'));
              resolve(projectName);
            }
          });
      } else {
        shell.cd(path);
        shell.exec('git checkout master');
        shell.exec('git pull');
        resolve(projectName);
      }
    });
  });
  return res;
}

module.exports = downloadProject;