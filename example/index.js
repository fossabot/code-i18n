import { Editor } from './editor.js'
const { defineComponent } = Vue

export default defineComponent({
  name: '$404',
  components: {Editor},
  template: `<div class="app">
    <Editor></Editor>
  </div>`,
  setup() {
  }
})
