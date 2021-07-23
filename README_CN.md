# code-i18n

- [What is this?](#what-is-this)
- [Type](#type)
- [Usage](#usage)
  - [Installation](#installation)
  - [Documentation](#documentation)
- [Features](#features)
- [Tests](#tests)

## What is this?

`code-i18n` 是将代码中的中文转换为可执行函数的脚本
[![Netlify Status](https://api.netlify.com/api/v1/badges/644b446a-84ff-45cd-8267-c6b501b04114/deploy-status)](https://app.netlify.com/sites/code-i18n/deploys)

## Type

目前支持转换的语言

| Type |     Support      |
| :--: | :--------------: |
|  js  | <li> - [x] </li> |
| jsx  | <li> - [x] </li> |
|  ts  | <li> - [x] </li> |
| tsx  | <li> - [x] </li> |
| vue  | <li> - [x] </li> |

## Usage

`code-i18n` 导出一个很简单的函数，参数是 `source` 和 `config` ，返回值是一个对象，详见 [文档](#documentation)。

```javascript
import { transformCode } from 'code-i18n'
const source = 'const language = "中文"'

const { code } = transformCode(source, {
  type: 'js',
})
console.log(code) // const language = $t('StringLiteral_17_21');
console.log(stack) // [ { StringLiteral_17_21: "中文" } ]
```

如果发生解析错误，或许是因为使用了非常规语法，比如 展开语法 `[Spread syntax]`（默认支持）、修饰器 `[Decorator]`，不用担心，你可以按照如下配置对代码进行适配。

```javascript
transformCode(source, {
  type: 'js',
  parserOptions: {
    babel: {
      plugins: [['decorators', { decoratorsBeforeExport: true }]],
    },
  },
})
```

### Installation

`yarn add -D code-i18n`

### Documentation

下面使用 typescript 的形式介绍 `code-i18n` 使用方法。其中有些文档需要参考这些地方 [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser)、[babel-parser](https://babeljs.io/docs/en/babel-parser)、[espree](https://github.com/eslint/espree)

```typescript
import { ParserOptions as BabelParserOptions } from '@babel/parser'
import { Linter } from 'eslint'

interface ParserOptions {
  vue?: Linter.ParserOptions
  babel?: BabelParserOptions
}

interface Config {
  type: 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'
  identifier?: string
  ruleKey?: (node: t.Node) => string | number
  parserOptions?: ParserOptions
}

export declare function transformCode(
  code: string,
  config: Config
): {
  code: string
  stack: Record<string, string>[]
}
```

现在，`parserOptions` 已经存在默认值，当你发生有任何语法错误的时候检查此默认值是否符合预期。比如当你发现有 `optional expression`（可选链） 错误的时候，你需要配置如下信息。通常在解析 `vue` 文件的时候才会出现这些问题。

```javascript
transformCode(source, {
  parserOptions: {
    vue: {
      ecmaVersion: 11,
    },
  },
})
```

有的时候我们在编写 `vue` 代码的时候需要使用 `jsx` 的语法，现在你必须将 `parserOptions` 的 vue 属性进行更改。

```javascript
transformCode(source, {
  parserOptions: {
    vue: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})
```

好了，说了这么多，下面就是 `parserOptions` 的默认值。

```javascript
const DEFAULT_PARSER_OPTIONS = {
  // https://github.com/eslint/espree#options
  vue: {
    sourceType: 'module',
    ecmaVersion: 11,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  babel: {
    sourceType: 'module',
  },
}
```

## Example

这里使用一段代码来介绍 `code-i18n` 的项目用法。通常在写代码的过程中，需要时刻注意文本的硬编码，因为这会让产品失去不同语言的用户。市场上我发现了一些开源项目，他们通过 webpack 的能力，在 `build` 期间，向最终产物添加不可逆的转换代码，这很不友好，并且在发生错误的同时很难去甄别。

`code-i18n` 是将源码中的字符串替换成可执行函数，在开发的同时即可阅读语言部分的源码，并且可以将已经发布的产品国际化处理。这都得益于日趋强大的开源社区，在这里感谢 `babel` 和 `eslint` 组织。

下面是帮助我们将项目中所有中文字符转换成 `$t('xxxx')` 的函数，如果发生错误将打印对应的文件路径和错误日志

```javascript
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const { transformCode } = require('../../code-i18n/index')

const root = path.resolve(__dirname)

glob(
  'test/**',
  {
    cwd: root,
  },
  (err, matches) => {
    const paths = matches
      .filter((matche) => ['js', 'jsx', 'ts', 'tsx', 'vue'].includes(path.extname(matche).slice(1)))
      .map((item) => path.join(root, item))

    const content = paths.map((p) => fs.readFileSync(p, 'utf-8'))

    content
      .map((item, index) => (/[\u4e00-\u9fa5]/.test(item) ? { content: item, path: paths[index] } : false))
      .filter((a) => a)
      .forEach((source) => {
        try {
          const filetype = path.extname(source.path).slice(1)
          const { code } = transformCode(source.content, {
            type: filetype,
            parserOptions: {
              vue: {
                ecmaVersion: 11,
                ecmaFeatures: {
                  jsx: true,
                },
              },
            },
          })

          fs.writeFileSync(source.path, code, { encoding: 'utf-8' })
        } catch (e) {
          console.log(source.path, e)
        }
      })
  }
)
```

## Features

- StringLiteral
- TemplateLiteral
- JSXText
- JSXAttribute
- Vue
  - Literal
  - VText
  - VAttribute
  - VLiteral
  - TemplateLiteral

## Tests

运行 `yarn test` 进行测试。

当前测试覆盖率表。

| File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------ | ------- | -------- | ------- | ------- | ----------------- |
| All files    | 100     | 90.57    | 100     | 100     |
| core         | 100     | 90.57    | 100     | 100     |
| parser.ts    | 100     | 100      | 100     | 100     |
| transform.ts | 100     | 91.3     | 100     | 100     | 68,107            |
| vue.ts       | 100     | 89.29    | 100     | 100     | 38,147,170        |
| utils        | 100     | 100      | 100     | 100     |
| index.ts     | 100     | 100      | 100     | 100     |
