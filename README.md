# code-i18n

- [What is this?](#what-is-this)
- [Type](#type)
- [Usage](#usage)
  - [Installation](#installation)
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

### Installation

`yarn add -D code-i18n`

### Documentation

```typescript
interface Config {
  ruleKey?: (node: t.Node) => string | number
  readonly identifier?: string
  type: 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'
}
export declare function transformCode(
  code: string,
  config: Config
): {
  code: string
  stack: Record<string, string>[]
}
```

## Features

+ StringLiteral
+ TemplateLiteral
+ JSXText
+ JSXAttribute

## Tests

Run `yarn test` to test.

Current test coverage table

---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |    90.57 |     100 |     100 |                   
 core          |     100 |    90.57 |     100 |     100 |                   
  parser.ts    |     100 |      100 |     100 |     100 |                   
  transform.ts |     100 |     91.3 |     100 |     100 | 68,107            
  vue.ts       |     100 |    89.29 |     100 |     100 | 38,147,170        
 utils         |     100 |      100 |     100 |     100 |                   
  index.ts     |     100 |      100 |     100 |     100 |                   
---------------|---------|----------|---------|---------|-------------------
