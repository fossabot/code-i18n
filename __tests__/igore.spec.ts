import { transformCode } from '../src/index'

const template = `
// code-i18n-disabled
const country = '中国'
`

const template_line = `
const country = '中国'
// code-i18n-disabled-next-line
const city = '重庆'
`

const template_line_transform = `
const country = $t('StringLiteral_2_16_2_20');
// code-i18n-disabled-next-line
const city = '重庆';`

const template_vue = `
<template>
<div>中国</div>
</template>

<script>
// code-i18n-disabled
const city = '重庆'
</script>
`

const template_vue_line = `
<template>
<div>中国</div>
</template>

<script>
// code-i18n-disabled-next-line
const city = '重庆'
</script>
`

const template_vue_line_result = `
<template>
<div>{{$t('VText_3_5_3_7')}}</div>
</template>

<script>
// code-i18n-disabled-next-line
const city = '重庆'
</script>
`

describe('Igore', () => {
  test('igore js file', () => {
    const { code } = transformCode(template, {
      type: 'js'
    })
    expect(code).toEqual(template)
  })

  test('igore js next-line', () => {
    const { code } = transformCode(template_line, {
      type: 'js'
    })
    expect(code).toEqual(template_line_transform)
  })

  test('igore vue file', () => {
    const { code } = transformCode(template_vue, {
      type: 'vue'
    })
    expect(code).toEqual(template_vue)
  })

  test('igore vue next-line', () => {
    const { code } = transformCode(template_vue_line, {
      type: 'vue'
    })
    expect(code).toEqual(template_vue_line_result)
  })
})
