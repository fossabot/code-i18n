const { defineComponent, ref, onMounted } = Vue
// import ace from 'ace-builds'

export const Editor = defineComponent({
  name: '$404',
  template: '<div class="editor" ref="editor"></div>',
  setup() {
    const editor = ref(null)

    onMounted(() => {
      const editors = ace.edit(editor.value)
      console.log(editors)
      // editor.setTheme('ace/theme/twilight')
      editors.session.setMode(Mode)
    })

    return {
      editor,
    }
  },
})
