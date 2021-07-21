import Parser from '../src/core/parser'
import Transform from '../src/core/transform'
import { Options } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'tsx',
  })

  const transform = new Transform(parser, config)
  return transform.render()
}

type StackItem = Record<string, string>

describe('TSX', () => {
  test('StringLiteral [VariableDeclarator]', () => {
    const source = 'const language: ReactNode = () => <div aria-name="宝宝"></div>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ JSXAttribute_1_39_1_53: '宝宝' }]))
    expect(code).toBe("const language: ReactNode = () => <div aria-name={$t('JSXAttribute_1_39_1_53')}></div>;")
  })
})
