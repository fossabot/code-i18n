import { parse, ParserPlugin } from '@babel/parser'
import { File } from '@babel/types'

export type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'

export interface Props {
  content: string
  type: ParserType
}

export default class Parser implements Props {
  readonly content: string
  readonly type: ParserType
  readonly ast: File

  constructor(props: Props) {
    this.content = props.content
    this.type = props.type

    this.ast = this._transform()
  }

  private _transform() {
    const Plugins: {
      [x in ParserType]: ParserPlugin[]
    } = {
      js: [],
      jsx: ['jsx'],
      ts: ['typescript'],
      tsx: ['jsx', 'typescript'],
      vue: [], // TODO
    }
    return parse(this.content, {
      plugins: Plugins[this.type],
    })
  }
}
