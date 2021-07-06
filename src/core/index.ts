import fs from 'fs'
import path from 'path'
import glob from 'glob'
import prettier from 'prettier'
import { parserCore, TrackNormalized, trackNormalized } from './core'
export * from './core'

// Todo remove
const rootPath = path.join(__dirname, '../../..')

export const readAllFile = (root: string) => {
  const suffix = ['js', 'vue']
  let paths: string[] = []
  return new Promise<string[]>((resole, reject) => {
    for (let i = 0; i < suffix.length; i++) {
      const mime = suffix[i]
      glob(
        `**/*.${mime}`,
        {
          cwd: root,
          ignore: ['node_nodules'],
        },
        (err, matches) => {
          if (err) {
            reject()
            return console.error(err)
          }
          const absolutePath = matches.map((filename) => {
            return path.join(root, filename)
          })
          paths = paths.concat(absolutePath)
          if (i === suffix.length - 1) {
            resole(paths)
          }
        }
      )
    }
  })
}

const writeHandle = (err: any) => {
  if (err) {
    console.log('写入失败', err)
    return false
  }
  return true
}

export const normalizedJsonToFile = (normalized: TrackNormalized) => {
  let normalizedJson: Record<string, string> = {}
  if (normalized.length) {
    normalized.forEach((item) => {
      Object.assign(normalizedJson, {
        [item.key]: item.output,
      })
    })
  }
  return normalizedJson
}

export const parser = (config: Partial<{ content: string; dir: string; path: string }>) => {
  const merge = (file: string, path?: string) => {
    const filetrack = parserCore(file, path)
    const normalized = trackNormalized(filetrack, rootPath)
    let filename
    if (path) {
      const pathSplit = path.split('/')
      filename = pathSplit[pathSplit.length - 1]
    }
    
    const type = normalized.length ? normalized[0].fileType : undefined
    return {
      normalized: normalized,
      key: path,
      filename: filename,
      type: type,
    }
  }

  const { path, dir, content } = config

  if (dir) {
    return readAllFile(dir).then((filePath) => {
      return filePath
        .map((absolutePath: string) => {
          const file = fs.readFileSync(absolutePath, {
            encoding: 'utf8',
          })
          return merge(file, absolutePath)
        })
        .filter((item) => {
          return item.normalized.length > 0
        })
    })
  }

  if (path) {
    const file = fs.readFileSync(path, {
      encoding: 'utf8',
    })
    return Promise.resolve([merge(file, path)])
  }

  if (content) {
    return Promise.resolve([merge(content)])
  }

  return Promise.resolve([])
}

export const writeOutputCode = (path: fs.PathLike | fs.promises.FileHandle, code: string, type: string) => {
  let formatCode
  try {
    formatCode = prettier.format(code, {
      parser: type === 'js' ? 'babel' : 'vue',
      singleQuote: true,
      tabWidth: 2,
    })
  } catch (e) {
    formatCode = code
    fs.promises.writeFile(path, formatCode).then(writeHandle)
    throw e
  }

  return fs.promises.writeFile(path, formatCode).then(writeHandle)
}

export const writeLanguageZhCn = (content: any, filePath: string) => {
  const fileLinkPath = filePath || path.join(rootPath, 'script/j18n/zh-cn.json')
  const source = prettier.format(JSON.stringify(content), {
    parser: 'json-stringify',
  })
  return fs.promises.writeFile(fileLinkPath, source).then(writeHandle)
}
