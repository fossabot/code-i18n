import { parse, ParserPlugin } from '@babel/parser'
import { parse as vueParser, RootNode, TemplateChildNode } from '@vue/compiler-dom'
import { File } from '@babel/types'

type RootNodeChildren = TemplateChildNode & {
  tag: 'script' | 'template'
  children: {
    content: string
  }[]
}

export type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'

export interface Props {
  content: string
  type: ParserType
}

export default class Parser implements Props {
  readonly content: string
  readonly type: ParserType
  readonly ast: File

  vueTemplateNode: RootNode | undefined

  constructor(props: Props) {
    this.content = props.content
    this.type = props.type

    let script = this.content
    if (this.type === 'vue') {
      console.error('NOT SOPPORT TYPE')
      this.vueTemplateNode = this._parserVue()
      const scriptNode = (this.vueTemplateNode.children as RootNodeChildren[]).find(node => node.tag === 'script')
      if (scriptNode) {
        script = scriptNode.children[0].content
      } else {
        console.warn('TODO warn script-node null')
      }
    }

    this.ast = this._parser(script)
  }

  private _parserVue() {
    const ast = vueParser(this.content)
    return ast
  }

  private _parser(script: string) {
    const Plugins: {
      [x in ParserType]: ParserPlugin[]
    } = {
      js: [],
      vue: [],
      jsx: ['jsx'],
      ts: ['typescript'],
      tsx: ['jsx', 'typescript']
    }
    return parse(script, {
      plugins: Plugins[this.type],
      sourceType: 'module'
    })
  }
}
