import fs from 'fs'
import { readAllFile } from '../core/index'

export default function remove(path: string | string[], zh: Record<string, unknown>) {

  let p: Promise<string[]>[] = []
  if (Array.isArray(path)) {
    p.push(...path.map(s => readAllFile(s)))
  } else {
    p = [readAllFile(path)]
  }
  const tasks = Promise.all(p);

  return tasks
    .then((args) => {
      return [...args].flat();
    })
    .then(filePath => {
      const contents = filePath.map(absolutePath => {
        const file = fs.readFileSync(absolutePath, {
          encoding: 'utf8'
        });
        return file;
      });
  
      const r: Record<string, unknown> = {};
      Object.keys(zh).map(key => {
        if (contents.filter(c => c.includes(key)).length) {
          r[key] = zh[key];
        }
      });
  
      return r
    });
}

