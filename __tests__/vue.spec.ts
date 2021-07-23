import Parser from '../src/core/parser'
import Transform from '../src/core/transform'
import { Options } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'vue',
  })

  const transform = new Transform(parser, config)
  const { code, stack } = transform.render()
  return {
    code: code.replace(/[\n\s]/g, ''),
    stack,
  }
}

type StackItem = Record<string, string>

describe('Vue', () => {
  test('SFC TemplateBody [VText]', () => {
    const source = `
      <template>
        <div>中文</div>
      </template>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ VText_3_13_3_15: '中文' }]))
    expect(code).toBe(`<template><div>{{$t('VText_3_13_3_15')}}</div></template>`)
  })

  test('SFC TemplateBody [VText Escape]', () => {
    const source = `
    <template>
      <span class="back-list-text" @click="handleBack">&lt; 自动化列表</span>
      <div>中文</div>
    </template>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(
      expect.arrayContaining<StackItem>([{ VText_3_55_3_65: '< 自动化列表' }, { VText_4_11_4_13: '中文' }])
    )
    expect(code).toBe(
      `<template><spanclass=\"back-list-text\"@click=\"handleBack\">{{$t('VText_3_55_3_65')}}</span><div>{{$t('VText_4_11_4_13')}}</div></template>`
    )
  })

  test('SFC TemplateBody [VText Multi-line]', () => {
    const source = `
      <template>
        <div>中
        文</div>
      </template>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ VText_3_13_4_9: '中\n        文' }]))
    expect(code).toBe(`<template><div>{{$t('VText_3_13_4_9')}}</div></template>`)
  })

  test('SFC TemplateBody [VLiteral]', () => {
    const source = `
      <template>
        <div data-aria="帮助"></div>
      </template>
    `
    const expected = `<template><div:data-aria="$t('VLiteral_3_23_3_27')"></div></template>`
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ VLiteral_3_23_3_27: '帮助' }]))
    expect(code).toBe(expected)
  })

  test('SFC TemplateBody [VLiteral Multi-line]', () => {
    const source = `
      <template>
        <div data-aria="帮
        助"></div>
      </template>
    `
    const expected = `<template><div:data-aria="$t('VLiteral_3_23_4_10')"></div></template>`
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ VLiteral_3_23_4_10: '帮\n        助' }]))
    expect(code).toBe(expected)
  })

  test('SFC TemplateBody [Literal]', () => {
    const source = `
      <template>
        <div>{{'中文'}}</div>
      </template>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ Literal_3_15_3_19: '中文' }]))
    expect(code).toBe(`<template><div>{{$t('Literal_3_15_3_19')}}</div></template>`)
  })

  test('SFC TemplateBody [TemplateLiteral]', () => {
    const source = `
      <template>
        <div>{{\`\${name}中文\`}}</div>
      </template>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_3_15_3_26: '{0}中文' }]))
    expect(code).toBe(`<template><div>{{$t('TemplateLiteral_3_15_3_26',name)}}</div></template>`)
  })

  test('SFC TemplateBody [TemplateLiteral Multi-line]', () => {
    const source = `
      <template>
        <div>{{\`\${name}中
        文\`}}</div>
      </template>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_3_15_4_10: '{0}中\n        文' }]))
    expect(code).toBe(`<template><div>{{$t('TemplateLiteral_3_15_4_10',name)}}</div></template>`)
  })

  test('SFC Script [TemplateLiteral]', () => {
    const source = `
      <script>
        const a = \`名字\${name || '测试'}\`
      </script>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(expect.arrayContaining<StackItem>([{ TemplateLiteral_3_18_3_56: '名字{0}' }]))
    expect(code).toBe(`<script>consta=$t('TemplateLiteral_3_18_3_56',name||$t('Literal_3_31_3_35'))</script>`)
  })

  test('SFC Script [TemplateLiteral Multi-line]', () => {
    const source = `
      <script>
        const a = \`名
        字\${name || '测试'}
        年龄\`
      </script>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(
      expect.arrayContaining<StackItem>([{ TemplateLiteral_3_18_5_11: '名\n        字{0}\n        年龄' }])
    )
    expect(code).toBe(`<script>consta=$t('TemplateLiteral_3_18_5_11',name||$t('Literal_4_19_4_23'))</script>`)
  })

  test('SFC Script [TemplateLiteral contain]', () => {
    const source = `
      <script>
        const a = \`嘿嘿\${\`哈哈\${name}\`}\`
      </script>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(
      expect.arrayContaining<StackItem>([
        { TemplateLiteral_3_18_3_36: '嘿嘿{0}' },
        { TemplateLiteral_3_23_3_34: '哈哈{0}' },
      ])
    )
    expect(code).toBe(`<script>consta=$t('TemplateLiteral_3_18_3_36',$t('TemplateLiteral_3_23_3_34',name))</script>`)
  })

  test('SFC Script [TemplateLiteral multi-line contain]', () => {
    const source = `
      <script>
        const a = \`嘿嘿\${\`哈
        哈\${name}\`}\`
      </script>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(
      expect.arrayContaining<StackItem>([
        { TemplateLiteral_3_18_4_19: '嘿嘿{0}' },
        { TemplateLiteral_3_23_4_17: '哈\n        哈{0}' },
      ])
    )
    expect(code).toBe(`<script>consta=$t('TemplateLiteral_3_18_4_19',$t('TemplateLiteral_3_23_4_17',name))</script>`)
  })

  test('SFC File', () => {
    const source = `
      <template>
        <div a="中文" :b="'中文'">{{\`中文\${name}\`}}中文</div>
      </template>
      <script>
        const a = \`中文\${name}\`
        const b = '中文'
      </script>
    `
    const { code, stack } = codeI18n(source)
    expect(stack).toEqual(
      expect.arrayContaining<StackItem>([
        { Literal_7_18_7_22: '中文' },
        { VLiteral_3_15_3_19: '中文' },
        { Literal_3_24_3_28: '中文' },
        { VText_3_45_3_47: '中文' },
        { TemplateLiteral_6_18_6_29: '中文{0}' },
        { TemplateLiteral_3_74_3_85: '中文{0}' },
      ])
    )
    expect(code).toBe(
      `<template><div:a=\"$t('VLiteral_3_15_3_19')\":b=\"$t('Literal_3_24_3_28')\">{{$t('TemplateLiteral_3_74_3_85',name)}}{{$t('VText_3_45_3_47')}}</div></template><script>consta=$t('TemplateLiteral_6_18_6_29',name)constb=$t('Literal_7_18_7_22')</script>`
    )
  })

  test('SFC File [SpreadElement]', () => {
    const source = `
      <script>
       export default {
         computed: {
           ...mapState({
             name: state => 'Link',
             contury: state => (state.contury || '中国')
           })
         }
       }
      </script>
    `
    const { code } = codeI18n(source)
    expect(code).toBe(
      `<script>exportdefault{computed:{...mapState({name:state=>'Link',contury:state=>(state.contury||$t('Literal_7_49_7_53'))})}}</script>`
    )
  })
})
