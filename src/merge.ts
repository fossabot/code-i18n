/**
 * 合并语言文件
 * 1，需要 执行 render.js
 * 2，修复 parser-error.json 中指出的错误文件
 * 3，最后检查所有替换语法全部正确后执行
 */
const path = require('path');
const { writeLanguageZhCn } = require('./core/index');

const currentPath = path.join(__dirname);
const rootPath = path.join(currentPath, '../..');
const zhCNPath = path.join(rootPath, 'locale/zh-cn.json');

async function merge() {
  const zhAllJson = require(zhCNPath);
  const currentJson = require('./zh-cn-current.json');
  for (let key in currentJson) {
    const prev = zhAllJson[key],
      next = currentJson[key];
    if (zhAllJson[key] && prev !== next) {
      console.warn('merge conflict key:', key, 'prev:', prev, 'next:', next);
    } else {
      zhAllJson[key] = currentJson[key];
    }
  }
  await writeLanguageZhCn({ ...zhAllJson }, zhCNPath);
}

merge();
