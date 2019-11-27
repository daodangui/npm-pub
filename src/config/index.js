const path = require('path');

const getAddress = {
  type: 'input',
  name: 'address',
  message: '请输入待发布项目SSH地址或项目本地绝对路径：',
  validate: (value) => {
    if (/git@gitlab.tuhu.cn:/.test(value) || path.isAbsolute(value)) {
      return true;
    }
    return '请输入有效地址或路径';
  }
};

const npmUser = {
  user: 'easy_cc'
};

module.exports = {
  getAddress,
  npmUser
}