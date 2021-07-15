import { cloneDeep } from 'lodash'
import { isContainChinese } from '../utils/index'
import traverse from '@babel/traverse'
import generate, { GeneratorOptions, GeneratorResult } from '@babel/generator'
import * as t from '@babel/types'
import Parser from './parser'
import VueHelpers, { VueAST } from './vue'

const defaultRenderOptions: GeneratorOptions = {
  retainLines: true,
  jsescOption: {
    quotes: 'single',
  },
}

export interface Options {
  ruleKey?: (node: t.Node) => string | number
  readonly identifier?: string
}

export default class Transform {
  readonly parser: Parser
  readonly options: Options | undefined
  readonly fnName: string
  readonly stack: Record<string, string>[]

  vueHelpers: VueHelpers

  readonly identifier = '$t'

  constructor(parser: Parser, options?: Options) {
    this.parser = parser
    this.options = options

    this.fnName = this.options?.identifier || this.identifier
    this.stack = []
    this.vueHelpers = new VueHelpers()
  }

  _key(node: t.Node) {
    return this.options?.ruleKey
      ? this.options.ruleKey(node)
      : `${node.type}_${node.loc?.start.column}_${node.loc?.end.column}`
  }

  _StringFunction(node: t.StringLiteral) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: node.value,
    })
    return t.expressionStatement(t.callExpression(t.identifier(this.fnName), [t.stringLiteral(key)]))
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
    return t.expressionStatement(t.callExpression(t.identifier(this.fnName), [t.stringLiteral(key), ...args]))
  }

  _JSXTextFunction(node: t.JSXText) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: node.value,
    })
    return t.jSXExpressionContainer(t.callExpression(t.identifier(this.fnName), [t.stringLiteral(key)]))
  }

  _JSXAttributeFunction(node: t.JSXAttribute) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: (node.value as t.StringLiteral).value,
    })
    const value = t.jSXExpressionContainer(t.callExpression(t.identifier(this.fnName), [t.stringLiteral(key)]))
    return t.jSXAttribute(node.name, value)
  }

  _transform(script?: t.File) {
    const ast = cloneDeep(script || this.parser.ast)
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

  transform() {
    const { type } = this.parser
    if (type === 'vue') {
      return this.vueHelpers._transform(this)
    }

    return this._transform()
  }

  render(options: GeneratorOptions = defaultRenderOptions): { code: string; stack: Record<string, string>[] } {
    const { type } = this.parser
    const ast = this.transform()
    if (type === 'vue') {
      return this.vueHelpers.generate(ast as VueAST)
    }
    return {
      ...generate(ast as t.File, options, this.parser.content),
      stack: this.stack,
    }
  }
}
