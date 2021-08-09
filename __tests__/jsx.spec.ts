import Parser from '../src/core/parser'
import Transform from '../src/core/transform'
import { Options } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'jsx',
  })

  const transform = new Transform(parser, config)
  return transform.render()
}

type StackItem = Record<string, string>

describe('JSX', () => {
  test('JSXText', () => {
    const source = 'const language = <span>中文</span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ JSXText_1_23_1_25: '中文' }]))
    expect(code).toBe("const language = <span>{$t('JSXText_1_23_1_25')}</span>;")
  })

  test('JSXText [LogicalExpression]', () => {
    const source = 'const language = <span>{name || \'中文\'}</span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ StringLiteral_1_32_1_36: '中文' }]))
    expect(code).toBe("const language = <span>{name || $t('StringLiteral_1_32_1_36')}</span>;")
  })

  test('JSXText [LogicalExpression TemplateLiteral]', () => {
    const source = 'const language = <span>{name || `${name}中文`}</span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_1_32_1_43: '{0}中文' }]))
    expect(code).toBe("const language = <span>{name || $t('TemplateLiteral_1_32_1_43', name)}</span>;")
  })

  test('JSXAttribute', () => {
    const source = 'const language = <span a="中文"></span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ JSXAttribute_1_23_1_29: '中文' }]))
    expect(code).toBe("const language = <span a={$t('JSXAttribute_1_23_1_29')}></span>;")
  })

  test('JSXAttribute [JSXExpressionContainer]', () => {
    const source = 'const language = <span a={"中文"}></span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ StringLiteral_1_26_1_30: '中文' }]))
    expect(code).toBe("const language = <span a={$t('StringLiteral_1_26_1_30')}></span>;")
  })

  test('JSXAttribute [LogicalExpression]', () => {
    const source = 'const language = <span a={`${name || \'中文\'}`}></span>'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ StringLiteral_1_37_1_41: '中文' }]))
    expect(code).toBe("const language = <span a={`${name || $t('StringLiteral_1_37_1_41')}`}></span>;")
  })
})
