import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import ora from 'ora'
import { transformCode } from '../index'
import { CommandArgs } from '../interface'
import { keys } from 'lodash'
import { ParserType } from '../core/parser'
import { format } from 'prettier'

interface FormatOutput extends ReturnType<typeof transformCode> {
  name?: string
}

const root = process.cwd()
const spinner = ora()

function crop(s: string) {
  return s.length > 36 ? s.slice(0, 18) + ' ...... ' + s.slice(-18) : s
}

function formatOutput(message: FormatOutput[], stack: string | undefined) {
  const t = message.map(({ code, stack, name }) => {
    return {
      name: name || null,
      code: crop(code),
      stack: crop(stack.map((s) => JSON.stringify(s)).join(',')),
    }
  })
  console.table(t)

  if (stack) {
    const stackPath = path.resolve(root, stack)
    const so = message.map((m) => m.stack).flat()
    const o = so.reduce((prev, cur) => {
      const k = keys(cur)[0]
      prev[k] = cur[k]
      return prev
    }, {})
    fs.writeFileSync(
      stackPath,
      format(JSON.stringify(o), {
        parser: 'json',
      })
    )
  }
}

export function transformFile(filename: string, write: boolean | string) {
  const filepath = path.resolve(root, filename)
  const filetype = path.extname(filepath).slice(1) as ParserType
  const content = fs.readFileSync(filepath, 'utf-8')

  const { code, stack } = transformCode(content, {
    type: filetype,
  })

  if (typeof write === 'string') {
    fs.writeFileSync(path.resolve(root, write), code)
  }

  if (typeof write === 'boolean' && write) {
    fs.writeFileSync(filepath, code)
  }

  return { code, stack }
}

export function transformDirectory(dir: string, write: boolean, type: ParserType) {
  spinner.start('Transform ...')

  const dirpath = path.resolve(root, dir)

  return new Promise<FormatOutput[]>((resolve, reject) => {
    glob(
      `**/*.${type}`,
      {
        cwd: dirpath,
      },
      (err, matches) => {
        if (err) {
          console.log(err)
        } else {
          const paths = matches.map((item) => path.join(dirpath, item))

          const content = paths.map((p) => fs.readFileSync(p, 'utf-8'))

          const message = content
            .map((item, index) => (/[\u4e00-\u9fa5]/.test(item) ? { content: item, path: paths[index] } : false))
            .filter((a) => a)
            .map((source) => {
              if (!source) {
                return
              }
              try {
                const { code, stack } = transformCode(source.content, {
                  type: type,
                  parserOptions: {
                    vue: {
                      ecmaVersion: 11,
                      ecmaFeatures: {
                        jsx: true,
                      },
                    },
                  },
                })

                if (write) {
                  fs.writeFileSync(source.path, code, { encoding: 'utf-8' })
                }
                return { code, stack, name: source.path }
              } catch (e) {
                spinner.fail('Conversion failed' + chalk.blue(source.path + ':') + JSON.stringify(e))
              }
            })
            .filter((item) => {
              return item?.stack.length
            }) as FormatOutput[]

          spinner.succeed('Successful conversion')
          resolve(message)
        }
      }
    )
  })
}

export async function exec(command: Partial<CommandArgs> & { write: boolean | string }) {
  if (['code', 'name', 'dir'].filter((item) => keys(command).includes(item)).length >= 2) {
    console.log(chalk.yellow('Only one of code, name, dir can be selected'))
    return
  }

  if (command.code && !command.type) {
    console.log(chalk.yellow('When using the optional code parameter, you must specify its type'))
    return
  }

  if (command.dir && typeof command.write === 'string') {
    console.log(chalk.yellow('Cannot use --write(path) when using --dir'))
    return
  }

  if (command.dir && !command.type) {
    console.log(
      chalk.yellow('When you specify the path, you must set its --type, let me know which files you need to convert')
    )
    return
  }

  if (command.type && !['js', 'jsx', 'ts', 'tsx', 'vue'].includes(command.type)) {
    console.log(
      chalk.yellow(
        `The optional type parameter is ${command.type}, one of these must be specified ['js','jsx','ts','tsx','vue']`
      )
    )
    return
  }

  if (command.code && command.type) {
    const { code, stack } = transformCode(command.code, {
      type: command.type,
    })
    if (typeof command.write === 'string') {
      const filename = path.resolve(root, command.write)
      fs.writeFileSync(filename, code)
    }
    if (typeof command.write === 'boolean' && command.write) {
      console.log(chalk.yellow('When using --code, --write needs to specify the path'))
    }
    formatOutput([{ code, stack }], command.stack)
  }

  if (command.name) {
    const { code, stack } = transformFile(command.name, command.write)
    formatOutput([{ code, stack, name: command.name }], command.stack)
    if (command.write) {
      console.log(chalk.green(`The writing is successful, the file name is '${command.name}'`))
    }
  }

  if (command.dir && command.type) {
    const message = await transformDirectory(command.dir, command.write as boolean, command.type)
    formatOutput(message, command.stack)
    if (command.write) {
      console.log(chalk.green(`The writing is successful, and the following path is '${command.dir}'`))
    }
  }
}