import * as t from '@babel/types'
import { GeneratorOptions } from '@babel/generator'
import { Node } from 'vue-eslint-parser-private/ast/nodes'
import { ParserOptions, ParserType } from '../core/parser'

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export interface Options {
  readonly identifier?: string
  ruleKey?: (node: t.Node | Node, path?: string, value?: string) => string | number
  parserOptions?: ParserOptions
  path?: string
  generatorOptions?: GeneratorOptions
}

export interface Config extends Options {
  type: ParserType
}

export interface CommandArgs {
  code: string
  name: string
  dir: string
  type: ParserType
  stack: string
  config: string
  debug: boolean
}
