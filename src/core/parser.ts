import { parse, ParserPlugin, ParserOptions as BabelParserOptions } from '@babel/parser'
import { parse as parseForESLint } from 'vue-eslint-parser-private'
import { File } from '@babel/types'
import { ESLintProgram } from 'vue-eslint-parser-private/ast'
import { Linter } from 'eslint'
import { merge } from 'lodash'

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

  ignoreLine: Record<number, boolean>
  ignoreFile?: {
    code: string,
    stack: Record<string, string>[]
  }

  constructor(props: Props) {
    const DEFAULT_PARSER_OPTIONS: Required<ParserOptions> = {
      // https://github.com/eslint/espree#options
      vue: {
        sourceType: 'module',
        ecmaVersion: 11,
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
        },
      },
      babel: {
        sourceType: 'module',
      },
    }
    this.parserOptions = merge(DEFAULT_PARSER_OPTIONS, props.parserOptions)
    this.content = props.content
    this.type = props.type
    this.ignoreLine = {}

    this.ast = this._parser()
    this._comment()
  }

  private _parser() {
    if (this.type === 'vue') {
      return parseForESLint(this.content, this.parserOptions.vue)
    }
    const options = this.parserOptions.babel
    options.plugins = (options.plugins || []).concat(Plugins[this.type])
    return parse(this.content, options)
  }

  private _comment() {
    const { comments } = this.ast
    if (comments && comments.length) {
      const igore = comments
        .map((comment) => {
          return comment
        })
        .find((item) => item.value.trim() === 'code-i18n-disabled')
      if (igore) {
        this.ignoreFile = {
          code: this.content,
          stack: [],
        }
      }
      comments.forEach((comment) => {
        this.ignoreLine[comment.loc.start.line + 1] = comment.value.trim() === 'code-i18n-disabled-next-line'
      })
    }
  }
}
