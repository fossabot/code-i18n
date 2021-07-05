const { readAllFile, writeLanguageZhCn } = require('./core/index');
const path = require('path');
const zh = require('../../locale/zh-cn.json');

const rootPath = path.join(__dirname, '../../');
const v1 = path.join(rootPath, 'v1/src');
const v2 = path.join(rootPath, 'src');

const task = Promise.all([readAllFile(v1), readAllFile(v2)]);
task
  .then(([p1, p2]) => {
    return [...p1, ...p2];
  })
  .then(filePath => {
    const contents = filePath.map(absolutePath => {
      const file = require('fs').readFileSync(absolutePath, {
        encoding: 'utf8'
      });
      return file;
    });

    const r = {};
    Object.keys(zh).map(key => {
      if (contents.filter(c => c.includes(key)).length) {
        r[key] = zh[key];
      }
    });

    console.log('length:', Object.keys(r).length);
    writeLanguageZhCn({ ...r }, path.join(rootPath, 'locale/zh-cn.json'));
  });
