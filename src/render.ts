/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs');
const {
  parser,
  renderOutputCode,
  normalizedJsonToFile,
  writeLanguageZhCn,
  writeOutputCode
} = require('./core/index');

const rootPath = path.join(__dirname, '../../');
const v1 = path.join(rootPath, 'v1/src');
const v2 = path.join(rootPath, 'src');

const startTime = Date.now();

async function start() {
  const [v1Normalized, v2Normalized] = await Promise.all([
    parser(v1),
    parser(v2)
  ]);
  const test = [].concat(v1Normalized, v2Normalized).flat();

  const mergeJson = [];
  const errorFile = [];
  test.map(async json => {
    const normalized = json[json.key];
    const code = renderOutputCode(
      normalized,
      fs.readFileSync(json.key, { encoding: 'utf8' })
    );
    mergeJson.push(...normalized);
    try {
      await writeOutputCode(path.normalize(json.key), code, json.type);
    } catch (e) {
      // console.warn(e.stack);
      errorFile.push({
        name: json.key,
        error: e.stack
      });
    }
  });
  const json = normalizedJsonToFile(mergeJson);
  await writeLanguageZhCn(
    { ...json },
    path.join(rootPath, 'script/j18n/zh-cn-current.json')
  );
  await writeLanguageZhCn(
    errorFile,
    path.join(rootPath, 'script/j18n/parser-error.json')
  );
  console.log('Script time:', Date.now() - startTime, 'ms');
}

start();

/**
 * 可用 jest 进行测试，待改进
 */
async function test() {
  const test = await parser(path.join(rootPath, 'input'));

  const mergeJson = [];
  test.map(async json => {
    const normalized = json[json.key];
    const code = renderOutputCode(
      normalized,
      fs.readFileSync(json.key, { encoding: 'utf8' })
    );
    mergeJson.push(...normalized);
    try {
      await writeOutputCode(
        path.join(rootPath, 'output', json.filename),
        code,
        json.type
      );
    } catch (e) {
      console.warn(e.stack);
    }
  });
  const json = normalizedJsonToFile(mergeJson);
  await writeLanguageZhCn(
    { ...json },
    path.join(rootPath, 'output/script/j18n/zh-cn-test.json')
  );
  console.log('Script time:', Date.now() - startTime, 'ms');
}
// test();
