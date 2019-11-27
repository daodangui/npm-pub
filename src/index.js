/**
 * tnpm 自动发布
 */

const program = require('commander');
const inquirer = require('inquirer');
const publish = require('./publish');
const { getAddress } = require('./config');

program
  .version(require('../package').version)
  .option('-a, --address <address>', 'gitlab 项目仓库地址或本地绝对路径')
  .option('-b, --branch <branch>', '发布分支', 'master');

program.parse(process.argv);

let { address, branch } = program;

const questions = [];

if (!address) {
  questions.push(getAddress);
}

if (!questions.length) {
  publish(address, branch);
} else {
  inquirer.prompt(questions)
    .then(answers => {
      let { address } = answers;
      if (address) {
        publish(address, branch);
      }
    });
}
