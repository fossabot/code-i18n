import { Editor } from './editor.js'
import { Preview } from './preview.js'
const { defineComponent, ref } = Vue

export default defineComponent({
  components: {Editor, Preview},
  template: `<div class="app">
    <Editor v-model:value="source"></Editor>
    <Preview :code="codes"></Preview>
    <button class="transform" @click="handleClick">转换</button>
  </div>`,
  setup() {
    const source = ref()
    const codes = ref()
    const handleClick = () => {
      const {code} = CodeI18n.transformCode(source.value, {
        type: 'jsx'
      })
      codes.value = code
    }

    return {
      handleClick,
      source,
      codes
    }
  }
})
