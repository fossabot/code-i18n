export type FileType = 'vue' | 'js'
type Noon = () => void

interface Filetrack {
  filePath?: string
  fileType?: FileType
  source: string
  line: number
  output: string
  variable: string[]
  start: number
  end: number
  isVueTag: boolean
  isAttribute: boolean
  isAttributeExpression: boolean
  isJSXNodeExpression: boolean
}

export type TrackNormalized = ReturnType<typeof trackNormalized>

let _id = 0
const renderKey = (filePath?: string, rootPath?: string) => {
  if (filePath && rootPath) {
    return filePath.replace(rootPath, '').slice(1).replace(/\//g, '__').replace(/\..+$/, '')
  }

  return 'key_' + ++_id
}

const checkInExpression = (type: FileType, content: string, start: number) => {
  const isVue = type === 'vue'
  const beforeContent = content.slice(0, start)
  const isAttributeExpression = isVue ? /:[a-zA-Z-]*=".*/.test(beforeContent) : /[a-zA-Z]={/.test(beforeContent)
  return isAttributeExpression
}

const checkJSXExpression = (type: FileType, content: string, start: number) => {
  if (type === 'vue') {
    return false
  }
  const beforeContent = content.slice(0, start)
  return /.*{$/.test(beforeContent)
}

const charParser = (content: string, regexp: RegExp, line: number, attributeTag: number, type: FileType, cb: Noon) => {
  const match = content.match(regexp)
  const variable: any[] = []
  const chinese = /[\u4e00-\u9fa5]/
  const attr = attributeTag > 0
  let i = 0
  if (!match) {
    return null
  }
  const r = match
    .filter((item: string) => chinese.test(item))
    .map((item: string) => {
      const start = content.indexOf(item)
      const end = start + item.length

      const isAttributeExpression = attr ? checkInExpression(type, content, start) : false
      const isJSXNodeExpression = !attr ? checkJSXExpression(type, content, start) : false

      const output = item.replace(/\$\{.+?\}/g, (match: string | any[]) => {
        variable.push(match.slice(2, -1))
        return `{${i++}}`
      })
      return {
        source: content,
        line,
        output,
        variable,
        start,
        end,
        isAttribute: attr,
        isAttributeExpression,
        isJSXNodeExpression,
      }
    })
  cb()
  return r
}

const tagParser = (content: string, regexp: RegExp, isVue: boolean, line: number, attributeTag: number, cb: Noon) => {
  const variable: any[] = []
  let i = 0
  const match = content.match(regexp)
  if (!match) return {}
  let output = match[0]
  const start = match.index as number
  const end = start + output.length
  if (isVue) {
    output = output.replace(/\{\{.+?\}\}/g, (match: string | any[]) => {
      variable.push(match.slice(2, -2))
      return `{${i++}}`
    })
  }
  cb()
  return {
    source: content,
    line,
    output,
    variable,
    start,
    end,
    isVueTag: isVue,
    isAttribute: attributeTag > 0,
  }
}

const renderVueExpressionCode = (source: string, code: string, start: number, end: number) => {
  const tags = source
    .split('')
    .map((item: string, index: any) => {
      if (item === ' ') {
        return index
      }
      return null
    })
    .filter((item: any) => typeof item === 'number')
    .filter((item: number) => item < start)
  const tagIndex = tags[tags.length - 1]
  const rewriteCode = source.slice(0, tagIndex) + ' :' + source.slice(tagIndex + 1, start) + code + source.slice(end)
  return rewriteCode
}

const renderLinesCode = (normalized: TrackNormalized) => {
  let waitNormalizedCode: TrackNormalized = []

  const merge = (codeArray: TrackNormalized) => {
    let code = ''
    codeArray.forEach((item, index) => {
      const next = codeArray[index + 1]
      const prev = codeArray[index - 1]
      if (index === 0) {
        code += item.source.slice(0, item.start) + item.code
      } else if (index === codeArray.length - 1) {
        code += (item.source.slice(prev.end, item.start) + item.code + item.source.slice(item.end))
      } else {
        code += item.source.slice(item.end, next.start) + item.code
      }
    })
    return {
      line: codeArray[0].line,
      rewriteCode: code
    }
  }

  return normalized
    .map((item, index) => {
      const nextLine = normalized[index + 1]?.line
      if (item.line === nextLine) {
        waitNormalizedCode.push(item)
        return null
      } else {
        if (waitNormalizedCode.length) {
          waitNormalizedCode.push(item)
          const processed = merge(waitNormalizedCode)
          waitNormalizedCode = []
          return processed
        }
        return item
      }
    })
    .filter((item) => item) as {line: number; rewriteCode: string}[]
}

export const renderOutputCode = (normalized: TrackNormalized, file: string) => {
  if (normalized.length) {
    const code = file.split('\n')
    const normalize = renderLinesCode(normalized)
    normalize.forEach(item => {
      code[item.line] = item.rewriteCode
    })
    return code.join('\n')
  }
  return ''
}

export const trackNormalized = (filetrack: Filetrack[], rootPath: string) => {
  const json = filetrack.map((track, index: number) => {
    const prefixKey = renderKey(track.filePath, rootPath)
    const output = track.output.replace(/^["'`]/, '').replace(/["'`]$/, '')

    if (filetrack[index + 1] && track.line === filetrack[index + 1].line) {
      const key = `${prefixKey}__${track.line}___${index}`
      return {
        [key]: output,
        key: key,
        output,
      }
    }
    const key = `${prefixKey}__${track.line}`
    return {
      [key]: output,
      key: key,
      output,
    }
  })
  return json.map((item, index: number) => {
    let code,
      filling = '',
      rewriteCode = '',
      itemTrack = filetrack[index]
    const {
      variable,
      fileType,
      start,
      end,
      source,
      isVueTag,
      isAttribute,
      isAttributeExpression,
      isJSXNodeExpression,
    } = itemTrack
    if (Array.isArray(variable) && variable.length) {
      // filling expressions
      filling = `, ${variable.join(', ')}`
    }

    if (fileType === 'vue') {
      if (isVueTag) {
        // vue tag
        code = `{{ j18n.use('${item.key}'${filling}) }}`
      } else {
        if (isAttribute && !isAttributeExpression) {
          // vue attr
          code = `"j18n.use('${item.key}'${filling})"`
          // add v-bind
          rewriteCode = renderVueExpressionCode(source, code, start, end)
        } else {
          // vue script
          code = `j18n.use('${item.key}'${filling})`
        }
      }
    } else {
      if (!isAttribute) {
        code = `j18n.use('${item.key}'${filling})`
      } else {
        // isJSXNodeExpression {`xxx`} mode
        if ((isAttribute && isAttributeExpression) || isJSXNodeExpression) {
          code = `j18n.use('${item.key}'${filling})`
        } else {
          code = `{ j18n.use('${item.key}'${filling}) }`
        }
      }
    }
    rewriteCode = rewriteCode || source.slice(0, start) + code + source.slice(end)

    return {
      ...itemTrack,
      ...item,
      code: code,
      rewriteCode: rewriteCode,
    }
  })
}

export const parserCore = (content: string, path?: string): Filetrack[] => {
  const double = /".*?"/g
  const single = /'.*?'/g
  const backtick = /`.*?`/g
  const charRegexp = /["'`].*?["'`]/
  const htmlChineseRegexp = /(?<=>).{0,}[\u4e00-\u9fa5].{0,}(?=<)/
  const allChineseRegexp = /[\u4e00-\u9fa5]{1,}.*?[\u4e00-\u9fa5]{1,}/

  let isVue: boolean,
    type: FileType,
    attributeTag = 0,
    processed = false
  if (path) {
    type = (path.match(/\..*?$/) as RegExpMatchArray)[0].slice(1) as FileType
    isVue = type === 'vue'
  }

  if (charRegexp.test(content) || htmlChineseRegexp.test(content) || allChineseRegexp.test(content)) {
    return content
      .split('\n')
      .map((lineContent: string, line: any) => {
        if (/<[a-zA-Z]+/.test(lineContent)) {
          attributeTag++
        }

        const tagClose = () => {
          const close = /<.+>/.test(lineContent) || /^>/.test(lineContent.trim()) || /\/>/.test(lineContent)
          if (close) {
            attributeTag = attributeTag > 0 ? attributeTag - 1 : 0
          }
        }

        if (isVue && attributeTag && double.test(lineContent) && single.test(lineContent)) {
          // vue template ExpressionStatement
          return charParser(lineContent, single, line, attributeTag, type, tagClose)
        }

        if (htmlChineseRegexp.test(lineContent)) {
          return tagParser(lineContent, htmlChineseRegexp, isVue, line, attributeTag, tagClose)
        }

        if (charRegexp.test(lineContent)) {
          processed = true
          let parser = []
          if (backtick.test(lineContent)) {
            const p = charParser(lineContent, backtick, line, attributeTag, type, tagClose)
            if (p && p.length) {
              parser.push(...p)
            }
          }
          if (double.test(lineContent)) {
            const p = charParser(lineContent, double, line, attributeTag, type, tagClose)
            if (p && p.length) {
              parser.push(...p)
            }
          }
          if (single.test(lineContent)) {
            const p = charParser(lineContent, single, line, attributeTag, type, tagClose)
            if (p && p.length) {
              parser.push(...p)
            }
          }
          if (parser.length) {
            return parser
          }
        }

        if (
          allChineseRegexp.test(lineContent) &&
          !lineContent.includes('//') &&
          !lineContent.includes('* ') &&
          !/<!--.*-->/.test(lineContent)
        ) {
          return tagParser(lineContent, allChineseRegexp, isVue, line, attributeTag, tagClose)
        }

        !processed && tagClose()

        processed = false

        return null
      })
      .filter((item) => {
        if (Array.isArray(item)) {
          return item.length > 0
        }
        return !!item
      })
      .flat()
      .map((item: any) => ({ ...item, filePath: path, fileType: type }))
  }

  return []
}
