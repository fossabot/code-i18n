import { parse } from '@babel/parser'
import Parser from '../src/core/parser'
import Transform, { Options } from '../src/core/transform'
import { ArrayElement } from '../src/interface/index'

function codeI18n(source: string, config?: Options) {
  const parser = new Parser({
    content: source,
    type: 'vue',
  })

  const transform = new Transform(parser, config)
  return transform.render()
}

type StackItem = Record<string, string>

describe('VUE', () => {
  test('', () => {
    const source = `
    <template>
  <p>{{ greeting || '中文' }} 中文!</p>
  <CustomAAA />
</template>

<script>
export default {
  data () {
    return {
      greeting: "中文"
    };
  }
};
</script>
    `
    const { code, stack } = codeI18n(source)
    console.log(code)
  })
})
