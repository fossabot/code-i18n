import i18n from '../src/index'

describe('Basic string replacement', () => {
  test('Replace chinese [double]', async () => {
    const source = 'const a = "中文"'
    const code = await i18n({
      content: source,
    })
    expect(code.language.key_1__0).toBe('中文')
    expect(code.overwriteCode[0].code).toBe("const a = j18n.use('key_1__0')")
  })

  test('Replace chinese [single]', async () => {
    const source = "const a = '中文'"
    const code = await i18n({
      content: source,
    })
    expect(code.language.key_2__0).toBe('中文')
    expect(code.overwriteCode[0].code).toBe("const a = j18n.use('key_2__0')")
  })

  test('Replace chinese [backtick]', async () => {
    const source = 'const a = `中文`'
    const code = await i18n({
      content: source,
    })
    expect(code.language.key_3__0).toBe('中文')
    expect(code.overwriteCode[0].code).toBe("const a = j18n.use('key_3__0')")
  })
})
