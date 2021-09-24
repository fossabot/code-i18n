import { Node, ESLintProgram, VText, VLiteral, ESLintLiteral } from 'vue-eslint-parser-private/ast/nodes'
import { ESLintTemplateLiteral } from 'vue-eslint-parser-private/ast'
import { traverseNodes, parse } from 'vue-eslint-parser-private'
import { isContainChinese, isIgoreLine } from '../utils/index'
import { Options } from '../interface'
import Parser from './parser'

export default class VueHelpers {
  private map: Map<
    {
      type: string
      source: string
      sourceLength?: number
      range: [number, number]
      key: string | number
      language: string
      length: number
    },
    string
  >
  readonly parser: Parser
  readonly options: Options | undefined
  private identifier = '$t'
  private stack: Record<string, string>[]
  private content: string

  constructor(parser: Parser, options?: Options) {
    this.map = new Map()
    this.options = options
    this.parser = parser
    this.stack = []
    this.content = this.parser.content
    this.identifier = this.options?.identifier || this.identifier
  }

  _renderKey(ast: Node) {
    const loc = ast.loc
    return this.options?.ruleKey
      ? this.options.ruleKey(ast, this.options.path)
      : `${ast.type}_${loc.start.line}_${loc.start.column}_${loc.end.line}_${loc.end.column}`
  }

  _generate() {
    const stack: Record<string, string>[] = []
    const map = [...this.map.entries()]

    let code = this.content

    for (const [k, v] of map) {
      code = code.slice(0, k.range[0]) + v + code.slice(k.range[1])
      stack.push({
        [k.key]: k.language,
      })
      // recalculate
      for (let i = 0; i < map.length; i++) {
        const [k1] = map[i]
        if (k1.range[0] > k.range[1]) {
          const diff = k.length - (k.sourceLength || k.source.length)
          const range: [number, number] = [k1.range[0] + diff, k1.range[1] + diff]
          map[i][0] = {
            ...map[i][0],
            range: range,
          }
        }
        if (k1.range[0] > k.range[0] && k1.range[1] < k.range[1]) {
          // contain
          const diff = code.indexOf(k1.source)
          const range: [number, number] = [diff, diff + k1.source.length]
          map[i][0] = {
            ...map[i][0],
            range: range,
          }
        }
      }
    }

    // clear map
    this.map = new Map()

    // keep stack
    this.stack.push(...stack)

    this.content = code

    return {
      code: code,
      stack: this.stack,
    }
  }

  _traverseTemplateBody(ast: VText | VLiteral | ESLintLiteral) {
    if (!isContainChinese(ast.value as string)) {
      return
    }
    if (!isIgoreLine(this.parser.ignoreLine, ast)) {
      return
    }

    const key = this._renderKey(ast)

    if (ast.type === 'VText') {
      const v = `{{${this.identifier}('${key}')}}`
      // fixed html Escape
      const sourceLength = this.parser.content.slice(ast.range[0], ast.range[1]).length
      this.map.set(
        {
          type: 'VText',
          source: ast.value,
          sourceLength: sourceLength,
          range: ast.range,
          key: key,
          language: ast.value,
          length: v.length,
        },
        v
      )
    }
    if (ast.type === 'VLiteral') {
      const rawkey = ast.parent.key.rawName
      const source = this.parser.content.slice(ast.parent.range[0], ast.parent.range[1])
      const v = `:${rawkey}="${this.identifier}('${key}')"`
      this.map.set(
        {
          type: 'VLiteral',
          source: source,
          range: ast.parent.range,
          key: key,
          language: ast.value,
          length: v.length,
        },
        v
      )
    }

    if (ast.type === 'Literal') {
      const source = (ast as unknown as { raw: string }).raw
      const v = `${this.identifier}('${key}')`
      this.map.set(
        {
          type: 'Literal',
          source: source,
          range: ast.range,
          key: key,
          language: source.slice(1, -1),
          length: v.length,
        },
        v
      )
    }
  }

  _traverseTemplateLiteral(ast: ESLintTemplateLiteral) {
    if (ast.quasis.find((quasi) => isContainChinese(quasi.value.raw)) && isIgoreLine(this.parser.ignoreLine, ast)) {
      const key = this._renderKey(ast)
      const content = this.content

      const source = content.slice(ast.start, ast.end)

      const args = ast.expressions.map((expression) => {
        return content.slice(expression.start, expression.end)
      })

      let language = source,
        i = 0
      args.map((arg) => {
        const regexp = new RegExp(
          `\\$\\{.{0,}${arg
            .split('')
            .map((item) => (/[\da-zA-Z]/.test(item) ? item : '\\' + item))
            .join('')
            .slice(2)}.{0,}\\}`
        )
        language = language.replace(regexp, `{${i++}}`)
      })

      const v = `${this.identifier}('${key}'${args.length ? ',' : ''} ${args.join(', ')})`
      this.map.set(
        {
          type: 'TemplateLiteral',
          source: source,
          range: ast.range,
          key: key,
          language: language.slice(1, -1),
          length: v.length,
        },
        v
      )
    }
  }

  _traverse(ast: ESLintProgram, keys: string[]) {
    const self = this
    traverseNodes(ast, {
      visitorKeys: keys,
      enterNode(node, parent) {
        if (keys.includes(node.type) && node.type === 'TemplateLiteral') {
          self._traverseTemplateLiteral(node as any)
        } else {
          self._traverseTemplateBody(node as any)
        }
      },
      leaveNode(node, parent) {},
    })
  }

  _transform() {
    this._traverse(this.parser.ast as ESLintProgram, ['Literal', 'VText', 'VAttribute', 'VLiteral'])
    const { code } = this._generate()
    const ast = parse(code, this.parser.parserOptions.vue)
    this._traverse(ast, ['TemplateLiteral'])
  }

  generate() {
    this._transform()
    return this._generate()
  }
}
