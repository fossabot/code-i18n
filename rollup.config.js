import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import external from 'rollup-plugin-peer-deps-external'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import packages from './package.json'

const extensions = ['.ts']

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}

const plugins = [
  external({ includeDependencies: true }),
  json(),
  nodeResolve({
    extensions,
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    extensions,
    babelHelpers: 'runtime',
  }),
]

module.exports = [
  {
    input: resolve('src/index.ts'),
    output: {
      file: packages.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: plugins,
  },
  {
    input: resolve('src/index.ts'),
    output: {
      file: packages.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: plugins.concat([
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'types',
        emitDeclarationOnly: true,
      }),
    ]),
  },
  {
    input: 'dist/esm/types/src/index.d.ts',
    output: [{ file: packages.types, format: 'esm' }],
    plugins: [external({ includeDependencies: true }), dts(), del({ targets: ['dist/esm/types'], hook: 'buildEnd' })],
  },
  {
    input: resolve('src/bin/index.ts'),
    output: {
      file: packages.bin,
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    plugins: plugins,
  },
]
