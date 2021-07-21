import Parser from '../src/core/parser'
import Transform from '../src/core/transform'
import { Options } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'ts',
  })

  const transform = new Transform(parser, config)
  return transform.render()
}

type StackItem = Record<string, string>

describe('TS', () => {
  test('StringLiteral [VariableDeclarator]', () => {
    const source = 'const language: string = "中文"'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ StringLiteral_1_25_1_29: '中文' }]))
    expect(code).toBe("const language: string = $t('StringLiteral_1_25_1_29');")
  })
})
