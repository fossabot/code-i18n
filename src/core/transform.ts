import { Node } from '@babel/types'
import { cloneDeep } from 'lodash'
import { isContainChinese } from '../utils/index'
import traverse from '@babel/traverse'
import generate, { GeneratorOptions, GeneratorResult } from '@babel/generator'
import * as t from '@babel/types'
import Parser from './parser'

const defaultRenderOptions: GeneratorOptions = {
  retainLines: true,
  jsescOption: {
    quotes: 'single',
  },
}

export interface Options {
  ruleKey?: (node: Node) => string | number
  readonly identifier?: string
}

export default class Transform {
  readonly parser: Parser
  readonly options: Options | undefined
  readonly fnName: string
  readonly stack: Record<string, string>[]

  public converted: t.File | undefined

  #identifier = '$t'

  constructor(parser: Parser, options?: Options) {
    this.parser = parser
    this.options = options

    this.fnName = this.options?.identifier || this.#identifier
    this.stack = []
  }

  _key(node: Node) {
    return this.options?.ruleKey
      ? this.options.ruleKey(node)
      : `${node.type}_${node.loc?.start.column}_${node.loc?.end.column}`
  }

  _stringFunction(node: t.StringLiteral) {
    const key = String(this._key(node))
    this.stack.push({
      [key]: node.value,
    })
    return t.expressionStatement(t.callExpression(t.identifier(this.fnName), [t.stringLiteral(key)]))
  }

  _templateFunction(node: t.TemplateLiteral) {
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

  transform() {
    const ast = cloneDeep(this.parser.ast)
    const self = this
    traverse(ast, {
      enter(path, state) {
        // console.log(path, state)
      },
      StringLiteral(path) {
        if (isContainChinese(path.node.value)) {
          path.replaceWith(self._stringFunction(path.node))
        }
      },
      TemplateLiteral(path) {
        if (path.node.quasis.find((quasi) => isContainChinese(quasi.value.raw))) {
          path.replaceWith(self._templateFunction(path.node))
        }
      },
    })
    this.converted = ast
    return this
  }

  render(options: GeneratorOptions = defaultRenderOptions): GeneratorResult {
    if (this.converted) {
      return generate(this.converted, options, this.parser.content)
    }

    return this.transform().render(options)
  }

  getStack() {
    return this.stack
  }
}
