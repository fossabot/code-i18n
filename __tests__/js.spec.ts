import Parser from '../src/core/parser'
import Transform from '../src/core/transform'
import Pinyin from 'pinyin'
import { print } from 'recast'
import { Options } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'js',
    parserOptions: {
      babel: {
        plugins: [['decorators', { decoratorsBeforeExport: true }]],
      },
    },
  })

  const transform = new Transform(parser, config)
  return transform.render(config?.generatorOptions)
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
    const { code } = codeI18n(source, {
      generatorOptions: {
        retainLines: false
      }
    })
    expect(code).toBe(`const language = $t('TemplateLiteral_1_17_4_5', c || $t('StringLiteral_2_11_2_15'), b, null);`)
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
      ruleKey: (node) => `${node.type}_uuid`,
    })
    expect(code).toBe("const language = i18n('StringLiteral_uuid');")
  })

  test('Transform [Options identifier]', () => {
    const source = `const babel = {
      version: '7.1',
      author: '中国'
    }`
    const { code } = codeI18n(source, {
      identifier: 'i18n',
      generatorOptions: {
        retainLines: false,
      },
    })
    expect(code).toBe(`const babel = {
  version: '7.1',
  author: i18n('StringLiteral_3_14_3_18')
};`)
  })

  test('Transform [Options identifier]', () => {
    const source = `const babel = {
      version() {},
      author: '中国'
    }`
    const { ast } = codeI18n(source, {
      identifier: 'i18n',
    })
    const code = print(ast, {
      tabWidth: 2
    }).code
    expect(code).toBe(`const babel = {
  version() {},
  author: i18n(\"StringLiteral_3_14_3_18\")
};`)
  })

  test('Transform key [Generator]', () => {
    const source = 'const country = "中国"'
    const { code } = codeI18n(source, {
      ruleKey: (node, path, value) => {
        return Pinyin(value, {
          style: Pinyin.STYLE_NORMAL
        }).join('')
      },
    })
    expect(code).toBe(`const country = $t('zhongguo');`)
  })
})
