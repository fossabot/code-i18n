import * as t from '@babel/types'
import { Node } from 'vue-eslint-parser-private/ast/nodes'
import { ParserPlugin } from '@babel/parser'

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export interface Options {
  readonly identifier?: string
  ruleKey?: (node: t.Node | Node) => string | number
  plugins?: ParserPlugin[]
}
