import Parser from './core/parser'
import Transform from './core/transform'
import { Config } from '../src/interface/index'

export * as Parser from './core/parser'
export * as Transform from './core/transform'

export function transformCode(code: string, config: Config) {
  const parser = new Parser({
    content: code,
    type: config.type,
    parserOptions: config.parserOptions
  })

  const transform = new Transform(parser, config)
  return transform.render(config.generatorOptions)
}
