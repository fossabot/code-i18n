import { parse, ParserPlugin } from '@babel/parser'
import { parse as parseForESLint } from 'vue-eslint-parser-private'
import { File } from '@babel/types'
import { ESLintProgram } from 'vue-eslint-parser-private/ast'

export type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'

export interface Props {
  content: string
  type: ParserType
}

export default class Parser implements Props {
  readonly content: string
  readonly type: ParserType
  readonly ast: File | ESLintProgram

  constructor(props: Props) {
    this.content = props.content
    this.type = props.type

    this.ast = this._parser(this.content)
  }

  private _parser(script: string) {
    const Plugins: {
      [x in ParserType]: ParserPlugin[]
    } = {
      js: [],
      vue: [],
      jsx: ['jsx'],
      ts: ['typescript'],
      tsx: ['jsx', 'typescript'],
    }
    if (this.type === 'vue') {
      return parseForESLint(script, {
        sourceType: 'module',
      })
    }
    return parse(script, {
      sourceType: 'module',
      plugins: Plugins[this.type],
    })
  }
}
