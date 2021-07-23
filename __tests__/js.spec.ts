import Parser from '../src/core/parser'
import Transform from '../src/core/transform'
import { Options } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'js',
    parserOptions: {
      babel: {
        plugins: [['decorators', {decoratorsBeforeExport: true}]]
      }
    },
  })

  const transform = new Transform(parser, config)
  return transform.render()
}

type StackItem = Record<string, string>

describe('JS', () => {
  test('StringLiteral [VariableDeclarator]', () => {
    const source = 'const language = "中文"'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ StringLiteral_1_17_1_21: '中文' }]))
    expect(code).toBe("const language = $t('StringLiteral_1_17_1_21');")
  })

  test('StringLiteral [CallExpression]', () => {
    const source = "fn('中文')"
    const { code } = codeI18n(source)
    expect(code).toBe("fn($t('StringLiteral_1_3_1_7'));")
  })

  test('TemplateLiteral [no wrap]', () => {
    const source = 'const language = `${name}中文`'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_1_17_1_28: '{0}中文' }]))
    expect(code).toBe("const language = $t('TemplateLiteral_1_17_1_28', name);")
  })

  test('TemplateLiteral [no wrap / multi-parameter]', () => {
    const source = 'const language = `${name}中文${age}`'
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_1_17_1_34: '{0}中文{1}' }]))
    expect(code).toBe("const language = $t('TemplateLiteral_1_17_1_34', name, age);")
  })

  test('TemplateLiteral [wrap]', () => {
    const source = `const language = \`
    \${c || '测试'}中文\${
      b}\${null}
    \``
    const { code } = codeI18n(source)
    expect(code).toBe(`const language = $t('TemplateLiteral_1_17_4_5',
c || $t('StringLiteral_2_11_2_15'),
b, null);`)
  })

  test('Transform [Options identifier]', () => {
    const source = 'const language = "中文"'
    const { code } = codeI18n(source, {
      identifier: 'i18n',
    })
    expect(code).toBe("const language = i18n('StringLiteral_1_17_1_21');")
  })

  test('Transform [Options identifier]', () => {
    const source = 'const language = "中文"'
    const { code } = codeI18n(source, {
      identifier: 'i18n',
      ruleKey: (node) => `${node.type}_uuid`
    })
    expect(code).toBe("const language = i18n('StringLiteral_uuid');")
  })
})
