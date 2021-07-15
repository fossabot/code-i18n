import Parser, { ParserType } from './core/parser'
import Transform, { Options } from './core/transform'

export * from './core/parser'
export * from './core/transform'

export function transformCode(code: string, config: Options & { type: ParserType }) {
  const parser = new Parser({
    content: code,
    type: config.type,
  })

  const transform = new Transform(parser, config)
  return transform.render()
}
