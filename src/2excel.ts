const XLSX = require('xlsx');

const zh = require('../../locale/zh-cn.json');
const en = require('../../locale/en-us.json');

const json = Object.keys(zh).map(key => {
  return {
    位置: key,
    中文: zh[key],
    英文: null,
    自动翻译: en[key]
  };
});

const ws = XLSX.utils.json_to_sheet(json);

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, '测试');

XLSX.writeFile(wb, 'language.xlsx');
