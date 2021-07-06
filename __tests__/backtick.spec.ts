import i18n from '../src/index'

describe('ES6 Template', () => {
  test('[Single]', async () => {
    const source = 'const a = `中文${name}`'
    const code = await i18n({
      content: source,
    })
    expect(code.language.key_1__0).toBe('中文{0}')
    expect(code.overwriteCode[0].code).toBe("const a = j18n.use('key_1__0', name)")
  })

  test('[Multiple]', async () => {
    const source = 'const a = `我是${name},年龄${age}`'
    const code = await i18n({
      content: source,
    })
    expect(code.language.key_2__0).toBe('我是{0},年龄{1}')
    expect(code.overwriteCode[0].code).toBe("const a = j18n.use('key_2__0', name, age)")
  })

  test('[Multiple single and dobule]', async () => {
    const source = 'const a = `我是${name},年龄${age}` + "喜欢吃苹果" + \'和李子\''
    const code = await i18n({
      content: source,
    })
    expect(code.language.key_3__0___0).toBe('我是{0},年龄{1}')
    expect(code.language.key_4__0___1).toBe('喜欢吃苹果')
    expect(code.language.key_5__0).toBe('和李子')
    const rewrite = "const a = j18n.use('key_3__0___0', name, age) + j18n.use('key_4__0___1') + j18n.use('key_5__0')"
    expect(code.overwriteCode[0].code).toBe(rewrite)
  })

  test('[Multiple contain expression]', async () => {
    const source = 'const a = `我是${name || "不知道"},年龄${age}`'
    const code = await i18n({
      content: source,
    })
    console.log(code)
  })
})
