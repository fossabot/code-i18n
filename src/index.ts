import path from 'path'
import fs from 'fs'
import {
  parser,
  renderOutputCode,
  normalizedJsonToFile,
  writeOutputCode,
  TrackNormalized,
  FileType,
} from './core/index'

export * from './core/index'

export type SupportFileType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'

export interface Config {
  overwrite: boolean
  type: SupportFileType[]
  content: string
  path: string
  dir: string | string[]
}

export interface ErrorWriteFile {
  name: string
  error: unknown
}

export interface OverwriteCode {
  key?: string
  source: string
  code: string
  type?: FileType
}

export default async function (config: Partial<Config>) {
  const { dir, overwrite = false } = config

  let parserData = []

  if (dir) {
    const task = typeof dir === 'string' ? [parser({ ...config, dir })] : dir.map((d) => parser({ ...config, dir: d }))
    parserData = (await Promise.all(task)).flat()
  } else {
    parserData = await parser(config as Omit<Config, 'dir'>)
  }

  const overwriteCode: OverwriteCode[] = []
  const mergeJson: TrackNormalized = []
  const errorFile: ErrorWriteFile[] = []
  parserData.map(async (json) => {
    const normalized = json.normalized
    let file
    if (json.key) {
      file = fs.readFileSync(json.key, { encoding: 'utf8' })
    } else {
      file = config.content as string
    }
    const code = renderOutputCode(normalized, file)
    mergeJson.push(...normalized)
    if (overwrite && json.type && json.key) {
      try {
        await writeOutputCode(path.normalize(json.key), code, json.type)
      } catch (e) {
        errorFile.push({
          name: json.key,
          error: e.stack,
        })
      }
    }

    overwriteCode.push({
      key: json.key,
      source: file,
      code: code,
      type: json.type,
    })
  })

  const language = normalizedJsonToFile(mergeJson)
  if (overwrite) {
    return {
      language,
      overwriteCode,
      errorFile,
    }
  }

  return {
    language,
    overwriteCode,
  }
}
