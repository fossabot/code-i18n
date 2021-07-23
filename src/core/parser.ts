import { parse, ParserPlugin, ParserOptions as BabelParserOptions } from '@babel/parser'
import { parse as parseForESLint } from 'vue-eslint-parser-private'
import { File } from '@babel/types'
import { ESLintProgram } from 'vue-eslint-parser-private/ast'
import { Linter } from 'eslint'

export type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'

export interface ParserOptions {
  vue?: Linter.ParserOptions
  babel?: BabelParserOptions
}

export interface Props {
  content: string
  type: ParserType
  parserOptions?: ParserOptions
}

const Plugins: {
  [x in ParserType]: ParserPlugin[]
} = {
  js: [],
  vue: [],
  jsx: ['jsx'],
  ts: ['typescript'],
  tsx: ['jsx', 'typescript'],
}

export default class Parser implements Props {
  readonly content: string
  readonly type: ParserType
  readonly ast: File | ESLintProgram
  readonly parserOptions: Required<ParserOptions>

  constructor(props: Props) {
    const DEFAULT_PARSER_OPTIONS: Required<ParserOptions> = {
      vue: {
        sourceType: 'module',
        ecmaVersion: 2018,
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
        },
      },
      babel: {
        sourceType: 'module',
      },
    }
    this.parserOptions = Object.assign(DEFAULT_PARSER_OPTIONS, props.parserOptions)
    this.content = props.content
    this.type = props.type

    this.ast = this._parser()
  }

  private _parser() {
    if (this.type === 'vue') {
      return parseForESLint(this.content, this.parserOptions.vue)
    }
    const options = this.parserOptions.babel
    options.plugins = (options.plugins || []).concat(Plugins[this.type])
    return parse(this.content, options)
  }
}
