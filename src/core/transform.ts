import { cloneDeep, merge } from 'lodash'
import { isContainChinese } from '../utils/index'
import generate, { GeneratorOptions } from '@babel/generator'
import traverse from '@babel/traverse'
import { Options } from '../interface'
import VueHelpers from './vue'
import * as t from '@babel/types'
import Parser from './parser'

const defaultRenderOptions: GeneratorOptions = {
  retainLines: true,
  jsescOption: {
    quotes: 'single'
  },
}

export default class Transform {
  readonly parser: Parser
  readonly options: Options | undefined
  readonly stack: Record<string, string>[]

  private identifier = '$t'

  VueHelpers: VueHelpers

  constructor(parser: Parser, options?: Options) {
    this.parser = parser
    this.options = options

    this.identifier = this.options?.identifier || this.identifier
    this.stack = []

    this.VueHelpers = new VueHelpers(parser, options)
  }

  _key(node: t.Node) {
    const loc = node.loc as t.SourceLocation
    return this.options?.ruleKey
      ? this.options.ruleKey(node, this.options.path)
      : `${node.type}_${loc.start.line}_${loc.start.column}_${loc.end.line}_${loc.end.column}`
  }

  _StringFunction(node: t.StringLiteral) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: node.value,
    })
    return t.callExpression(t.identifier(this.identifier), [t.stringLiteral(key)])
  }

  _TemplateFunction(node: t.TemplateLiteral) {
    const key = String(this._key(node))
    const args: t.Expression[] = []

    let index = 0
    const value = node.quasis.map((quasis) => {
      if (quasis.value.raw) {
        return quasis.value.raw
      } else {
        return `{${index++}}`
      }
    })
    this.stack.push({
      [key]: value.join(''),
    })
    node.expressions.map((expression) => {
      if (!t.isTSType(expression)) {
        args.push(expression)
      }
    })
    return t.callExpression(t.identifier(this.identifier), [t.stringLiteral(key), ...args])
  }

  _JSXTextFunction(node: t.JSXText) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: node.value,
    })
    return t.jSXExpressionContainer(t.callExpression(t.identifier(this.identifier), [t.stringLiteral(key)]))
  }

  _JSXAttributeFunction(node: t.JSXAttribute) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: (node.value as t.StringLiteral).value,
    })
    const value = t.jSXExpressionContainer(t.callExpression(t.identifier(this.identifier), [t.stringLiteral(key)]))
    return t.jSXAttribute(node.name, value)
  }

  _transform() {
    const ast = cloneDeep(this.parser.ast) as t.File
    const self = this
    traverse(ast, {
      StringLiteral(path) {
        if (isContainChinese(path.node.value)) {
          path.replaceWith(self._StringFunction(path.node))
        }
      },
      TemplateLiteral(path) {
        if (path.node.quasis.find((quasi) => isContainChinese(quasi.value.raw))) {
          path.replaceWith(self._TemplateFunction(path.node))
        }
      },
      JSXText(path) {
        if (isContainChinese(path.node.value)) {
          path.replaceWith(self._JSXTextFunction(path.node))
        }
      },
      JSXAttribute(path) {
        const { value } = path.node
        if (t.isStringLiteral(value) && isContainChinese(value.value)) {
          path.replaceWith(self._JSXAttributeFunction(path.node))
        }
      },
    })
    return ast
  }

  _generate(ast: t.File, options: GeneratorOptions) {
    const { code } = generate(ast, options, this.parser.content)

    return {
      code,
      stack: this.stack,
      ast: ast
    }
  }

  render(options: GeneratorOptions = defaultRenderOptions): {
    code: string
    stack: Record<string, string>[]
    ast?: t.File
  } {
    if (!t.isFile(this.parser.ast)) {
      return this.VueHelpers.generate()
    }
    const ast = this._transform()
    const config = merge(defaultRenderOptions, options || {})
    return this._generate(ast, config)
  }
}
