import { TemplateChildNode, traverseNode, transform, createTransformContext, RootNode, generateCodeFrame, createCallExpression, createSimpleExpression } from '@vue/compiler-core'
import Transform from './transform'
import * as t from '@babel/types'
import { NodeTypes } from '@vue/compiler-dom'

export interface VueAST {
  ast: t.File
  template?: RootNode
}

export default class VueHelpers {
  constructor() {}

  _generate(nodes: TemplateChildNode[]) {
    nodes.map(node => {
      if (node.type === 1) {
        this._generate(node.children)
      }
      if (node.type === 2) {
      }
      if (node.type === 5) {
      }
    })
  }

  generate(vueAST: VueAST) {   
    let content = ''
    if (vueAST.template) {
      const code = this._generate(vueAST.template.children)
    }
    return {
      code: content,
      stack: [],
    }
  }

  traverse(ast: RootNode | undefined) {
    if (ast) {
      transform(ast, {
        nodeTransforms: [
          (node, context) => {
          }
        ]
      })
    }
    return ast
  }

  _transform(transform: Transform): VueAST {
    const {
      parser: { ast, vueTemplateNode },
      _transform,
    } = transform

    // transform script
    const asted = _transform.call(transform, ast)

    // transform template
    const template = this.traverse(vueTemplateNode)

    return {
      ast: asted,
      template,
    }
  }
}
