const path = require('path')
const babel = require('rollup-plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const extensions = ['.ts']

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}

module.exports = {
  input: resolve('./src/index.ts'),
  output: {
    file: 'index.js',
    format: 'cjs',
    exports: 'auto'
  },
  external: ['lodash', 'prettier', '@vue/compiler-dom', '@vue/compiler-core'],
  plugins: [
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
      runtimeHelpers: true
    }),
  ],
}
