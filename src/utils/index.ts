import { Node } from '@babel/core'
import { VNode, ESLintLiteral, ESLintTemplateLiteral } from 'vue-eslint-parser-private/ast/nodes'

export function isContainChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str)
}

export function isIgoreLine(igoreLine: Record<number, boolean>, node: Node | VNode | ESLintLiteral | ESLintTemplateLiteral) {
  if (node.loc && igoreLine[node.loc.start.line]) {
    return false
  }
  return true
}
