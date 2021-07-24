const path = require('path')
const babel = require('rollup-plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const json  = require('@rollup/plugin-json')
const { merge, keys } = require('lodash')
const { dependencies } = require('./package.json')

const extensions = ['.ts']

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}

const default_config = {
  external: keys(dependencies),
  plugins: [
    json(),
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
      runtimeHelpers: true,
    })
  ],
}

module.exports = [
  {
    input: resolve('src/index.ts'),
    output: {
      file: 'index.js',
      format: 'cjs',
      exports: 'auto',
    }
  },
  {
    input: resolve('src/bin/index.ts'),
    output: {
      file: 'bin.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
  },
].map(config => merge(config, default_config))
