import Parser from '../src/core/parser'
import Transform, { Options } from '../src/core/transform'
import { ArrayElement } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'jsx',
  })

  const transform = new Transform(parser, config)
  const { code } = transform.render()
  const stack = transform.getStack()

  return { code, stack }
}

type StackItem = Record<string, string>

describe('JSX', () => {
  test('JSXText', () => {
    const source = 'const language = <span>中文</span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ JSXText_23_25: '中文' }]))
    expect(code).toBe("const language = <span>{$t('JSXText_23_25')}</span>;")
  })

  test('JSXText [LogicalExpression]', () => {
    const source = 'const language = <span>{name || \'中文\'}</span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ StringLiteral_32_36: '中文' }]))
    expect(code).toBe("const language = <span>{name || $t('StringLiteral_32_36')}</span>;")
  })

  test('JSXText [LogicalExpression TemplateLiteral]', () => {
    const source = 'const language = <span>{name || `${name}中文`}</span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_32_43: '{0}中文' }]))
    expect(code).toBe("const language = <span>{name || $t('TemplateLiteral_32_43', name)}</span>;")
  })

  test('JSXAttribute', () => {
    const source = 'const language = <span a="中文"></span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ JSXAttribute_23_29: '中文' }]))
    expect(code).toBe("const language = <span a={$t('JSXAttribute_23_29')}></span>;")
  })
})
