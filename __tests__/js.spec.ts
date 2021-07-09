import Parser from '../src/core/parser'
import Transform, { Options } from '../src/core/transform'
import { ArrayElement } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'js',
  })

  const transform = new Transform(parser, config)
  const { code } = transform.render()
  const stack = transform.getStack()

  return { code, stack }
}

describe('Parser', () => {
  test('StringLiteral [VariableDeclarator]', () => {
    const source = 'const language = "中文"'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<ArrayElement<typeof stack>>([{ StringLiteral_17_21: '中文' }]))
    expect(code).toBe("const language = $t('StringLiteral_17_21');")
  })

  test('StringLiteral [CallExpression]', () => {
    const source = "fn('中文')"
    const { code } = codeI18n(source)
    expect(code).toBe("fn($t('StringLiteral_3_7'));")
  })

  test('TemplateLiteral [no wrap]', () => {
    const source = 'const language = `${name}中文`'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<ArrayElement<typeof stack>>([{ TemplateLiteral_17_28: '{0}中文' }]))
    expect(code).toBe("const language = $t('TemplateLiteral_17_28', name);")
  })

  test('TemplateLiteral [no wrap / multi-parameter]', () => {
    const source = 'const language = `${name}中文${age}`'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<ArrayElement<typeof stack>>([{ TemplateLiteral_17_34: '{0}中文{1}' }]))
    expect(code).toBe("const language = $t('TemplateLiteral_17_34', name, age);")
  })

  test('TemplateLiteral [wrap]', () => {
    const source = `const language = \`
    \${c || '测试'}中文\${
      b}\${null}
    \``
    const { code } = codeI18n(source)
    expect(code).toBe(`const language = $t('TemplateLiteral_17_5',
c || $t('StringLiteral_11_15'),
b, null);`)
  })

  test('Transform [Options identifier]', () => {
    const source = 'const language = "中文"'
    const { code } = codeI18n(source, {
      identifier: 'i18n',
    })
    expect(code).toBe("const language = i18n('StringLiteral_17_21');")
  })

  test('Transform [Options identifier]', () => {
    const source = 'const language = "中文"'
    const { code } = codeI18n(source, {
      identifier: 'i18n',
    })
    expect(code).toBe("const language = i18n('StringLiteral_17_21');")
  })
})
