const { defineComponent, ref, onMounted } = Vue

export const Editor = defineComponent({
  name: 'Editor',
  template: `<div class="editor-container">
    <div class="editor" ref="editor"></div>
    <div class="editor-placeholder">在这里粘贴或输入你的代码</div>
  </div>`,
  emits: ['update:value'],
  props: {
    value: String
  },
  setup(props, { emit }) {
    const editor = ref(null)

    const value = window.localStorage.getItem('source') || ''
    emit('update:value', value)

    const update = (editors) => {
      const val = editors.getSession().getValue()
      window.localStorage.setItem('source', val)
      emit('update:value', val)
    }

    onMounted(() => {
      const editors = ace.edit(editor.value)
      const value = window.localStorage.getItem('source') || ''
      editors.setValue(value)
      editors.setOptions({
        fontSize: "16px",
        tabSize: 2
      });
      editors.setTheme('ace/theme/chrome')
      editors.session.setMode('ace/mode/jsx')

      editors.getSession().on('change', function() {
        update(editors)
      });
    })

    return {
      editor,
    }
  },
})
