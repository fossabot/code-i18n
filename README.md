# code-i18n

[中文](./README_CN.md) English is with `google tranlate` automatic translation

- [What is this?](#what-is-this)
- [Type](#type)
- [Usage](#usage)
  - [Installation](#installation)
  - [Commander](#commander)
  - [Documentation](#documentation)
- [Features](#features)
- [Tests](#tests)

## What is this?

`code-i18n` is a script that converts Chinese in the code into executable functions
[![Netlify Status](https://api.netlify.com/api/v1/badges/644b446a-84ff-45cd-8267-c6b501b04114/deploy-status)](https://app.netlify.com/sites/code-i18n/deploys)

## Type

Languages currently supported for conversion

| Type |     Support      |
| :--: | :--------------: |
|  js  | <li> - [x] </li> |
| jsx  | <li> - [x] </li> |
|  ts  | <li> - [x] </li> |
| tsx  | <li> - [x] </li> |
| vue  | <li> - [x] </li> |

## Usage

`code-i18n` exports a convenience function, the parameters are `source` and `config`, the return value is an object, please see [Documentation](#documentation) for details.

```javascript
import { transformCode } from 'code-i18n'
const source = 'const language = "中文"'

const { code } = transformCode(source, {
  type: 'js',
})
console.log(code) // const language = $t('StringLiteral_17_21');
console.log(stack) // [ { StringLiteral_17_21: "中文" } ]
```

If a parsing error occurs, it may be due to the use of unconventional syntax, such as spread syntax `[Spread syntax]` (supported by default), decorator `[Decorator]`, don't worry, you can adapt the code according to the following configuration. For other grammatical errors, please pay attention to [babel](https://www.babeljs.cn/) for corresponding configuration.

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

```shell
yarn add -D code-i18n
```

```shell
npm install --save-dev code-i18n
```

### Commander

`code-i18n` provides a simple and efficient command line, enter `code-i18n --help` to view all supported operations. The reason why `code` is not used as a wake-up keyword is because vscode provides the `code` command line.

Before proceeding with the following operations, global installation is required

```shell
yarn global add code-i18n
npm install -g code-i18n
```

```
Usage: code-i18n [options]

Convert your code to help you code quickly (internationalization)

Options:
  -v, --version output the version number
  -c, --code <code> Convert the specified code
  -n, --name <file name> Convert the specified file
  -d, --dir <directory> Convert files under the specified path
  -s, --stack <file name> Specify the output location of the collected language pack (json)
  -w, --write [path] Specify the write path (only used in --code and --name) or overwrite the current file (default: false)
  -t, --type <js | jsx | ts | tsx | vue> Specify the current code type, must be specified when using --code
  -h, --help display help for command
```

Sometimes, I just want to see a simple code conversion, we only need to enter the following information

```shell
code-i18n -c "const message ='I love China'" -t js
#┌─────────┬──────┬────────────────────────────────────────────────┬──────────────────────────────────────────┐
#│ (index) │ name │                      code                      │                  stack                   │
#├─────────┼──────┼────────────────────────────────────────────────┼──────────────────────────────────────────┤
#│    0    │ null │ "const message = $t ...... teral_1_16_1_22');" │ '{"StringLiteral_1_16_1_22":"我爱中国"}'  │
#└─────────┴──────┴────────────────────────────────────────────────┴──────────────────────────────────────────┘
```

The information is cropped, because there is no way to display all the information on the `console` screen. At this time, you can add the `--write` parameter to output the code to a file

```shell
code-i18n -c "const message ='I love China'" -t js --write china.js
```

```javascript
// china.js
const message = $t('StringLiteral_1_16_1_22');
```

`code-i18n` can also convert the corresponding files, and it is extremely simple

```shell
code-i18n -n china.js -w
```

Convert all `js` files in the directory and write

```shell
code-i18n -d. -t js -w
```

At this point, you will find that the language pack has not been generated yet. We add `-s <path>` to the command line and it will output all Chinese information in the code to a json file.

```shell
code-i18n -d. -t js -s zh-cn.json -w
```

### Documentation

The following uses typescript to introduce how to use `code-i18n`. Some of these documents need to refer to these places [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser), [babel-parser](https://babeljs.io/docs/en/babel-parser), [espree](https://github.com/eslint/espree)

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

Now, `parserOptions` already has a default value. Check whether the default value meets expectations when you have any syntax errors. For example, when you find an error in `optional expression` (optional chain), you need to configure the following information. These problems usually occur when parsing `vue` files.

```javascript
transformCode(source, {
  parserOptions: {
    vue: {
      ecmaVersion: 11,
    },
  },
})
```

Sometimes we need to use the syntax of `jsx` when writing `vue` code, now you have to change the vue attribute of `parserOptions`.

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

Well, having said so much, here are the default values of `parserOptions`.

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

Here is a piece of code to introduce the project usage of `code-i18n`. Usually in the process of writing code, you need to always pay attention to the hard coding of the text, because this will make the product lose users of different languages. I have found some open source projects in the market. They use the ability of webpack to add irreversible conversion codes to the final product during the build period. This is very unfriendly and it is difficult to identify errors when they occur.

`code-i18n` is to replace the string in the source code with an executable function, you can read the source code of the language part while developing, and can internationalize the released product. This is all thanks to the growing open source community, and I would like to thank the `babel` and `eslint` organizations here.

The following is a function to help us convert all Chinese characters in the project into `$t('xxxx')`, if an error occurs, the corresponding file path and error log will be printed

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

Run `yarn test` to test.

Current test coverage table

| File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------ | ------- | -------- | ------- | ------- | ----------------- |
| All files    | 100     | 90.57    | 100     | 100     |
| core         | 100     | 90.57    | 100     | 100     |
| parser.ts    | 100     | 100      | 100     | 100     |
| transform.ts | 100     | 91.3     | 100     | 100     | 68,107            |
| vue.ts       | 100     | 89.29    | 100     | 100     | 38,147,170        |
| utils        | 100     | 100      | 100     | 100     |
| index.ts     | 100     | 100      | 100     | 100     |
