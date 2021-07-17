const { defineComponent, ref, onMounted, watchEffect } = Vue

export const Preview = defineComponent({
  name: 'Preview',
  template: `<div class="editor-container">
  <div class="preview" ref="editor"></div>
  <div class="editor-placeholder">点击转换按钮即可得到对应的代码</div>
</div>`,
  props: {
    code: String
  },

  setup(props) {
    const editor = ref(null)

    let editors
    onMounted(() => {
      editors = ace.edit(editor.value)
      editors.setOptions({
        fontSize: '16px',
        tabSize: 2,
      })
      editors.setTheme('ace/theme/chrome')
      editors.session.setMode('ace/mode/jsx')

      editors.setReadOnly(true)
    })

    watchEffect(() => {
      props.code && editors && editors.setValue(props.code)
    })

    return {
      editor,
    }
  },
})
