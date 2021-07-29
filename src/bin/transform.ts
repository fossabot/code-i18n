import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import ora from 'ora'
import { transformCode } from '../index'
import { CommandArgs, Config } from '../interface'
import { keys, merge, cloneDeep } from 'lodash'
import { ParserType } from '../core/parser'
import { format } from 'prettier'
import { log } from '../utils/assert'

interface FormatOutput extends ReturnType<typeof transformCode> {
  name?: string
}

type Command = Partial<CommandArgs> & { write: boolean | string } & Partial<{
    prettier: (path: string, node: string) => string
  }>

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

export function transformFile(filename: string, write: boolean | string, config: Partial<Config> & Command) {
  const filepath = path.resolve(root, filename)
  const filetype = path.extname(filepath).slice(1) as ParserType
  const content = fs.readFileSync(filepath, 'utf-8')

  let { code, stack } = transformCode(content, {
    type: filetype,
    path: filepath,
    ...config,
  })

  if (typeof write === 'string') {
    if (config.prettier && typeof config.prettier === 'function') {
      code = config.prettier(path.resolve(root, write), code)
    }
    fs.writeFileSync(path.resolve(root, write), code)
  }

  if (typeof write === 'boolean' && write) {
    if (config.prettier && typeof config.prettier === 'function') {
      code = config.prettier(filepath, code)
    }
    fs.writeFileSync(filepath, code)
  }

  return { code, stack }
}

export function transformDirectory(dir: string, config: Partial<Config> & Command) {
  spinner.start('Transform ...')

  const dirpath = path.resolve(root, dir)

  return new Promise<FormatOutput[]>((resolve, reject) => {
    glob(
      `**/*.${config.type}`,
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
                if (config.debug) {
                  log('Source: ', source)
                }

                let { code, stack } = transformCode(source.content, {
                  ...config,
                  path: source.path,
                } as Config)

                if (config.write && stack.length > 0) {
                  if (config.prettier && typeof config.prettier === 'function') {
                    code = config.prettier(source.path, code)
                  }
                  fs.writeFileSync(source.path, code, { encoding: 'utf-8' })
                }

                return { code, stack, name: source.path }
              } catch (e) {
                spinner.fail('Conversion failed ' + chalk.blue(source.path + ':\n') + JSON.stringify(e))
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

export async function exec(command: Command) {
  const configFile = path.resolve(root, '.code-i18n.js')

  let config: Partial<Config> & Command = {
    write: false,
  }

  if (command.config) {
    config = require(path.resolve(root, command.config))
  } else {
    const have = await new Promise((r) => {
      fs.access(configFile, (err) => {
        return r(!err)
      })
    }).catch((e) => {
      console.log(chalk.red(e))
    })
    if (have) {
      config = require(configFile)
    }
  }

  config = merge(config, cloneDeep(command))

  if (config.debug) {
    log('Config: ', config)
  }

  if (['code', 'name', 'dir'].filter((item) => keys(config).includes(item)).length >= 2) {
    console.log(chalk.yellow('Only one of code, name, dir can be selected'))
    return
  }

  if (config.code && !config.type) {
    console.log(chalk.yellow('When using the optional code parameter, you must specify its type'))
    return
  }

  if (config.dir && typeof config.write === 'string') {
    console.log(chalk.yellow('Cannot use --write(path) when using --dir'))
    return
  }

  if (config.dir && !config.type) {
    console.log(
      chalk.yellow('When you specify the path, you must set its --type, let me know which files you need to convert')
    )
    return
  }

  if (config.type && !['js', 'jsx', 'ts', 'tsx', 'vue'].includes(config.type)) {
    console.log(
      chalk.yellow(
        `The optional type parameter is ${config.type}, one of these must be specified ['js','jsx','ts','tsx','vue']`
      )
    )
    return
  }

  if (config.code) {
    let { code, stack } = transformCode(config.code, config as Config)
    if (typeof config.write === 'string') {
      const filename = path.resolve(root, config.write)
      if (config.prettier && typeof config.prettier === 'function') {
        code = config.prettier(filename, code)
      }
      fs.writeFileSync(filename, code)
    }
    if (typeof config.write === 'boolean' && config.write) {
      console.log(chalk.yellow('When using --code, --write needs to specify the path'))
    }
    formatOutput([{ code, stack }], config.stack)
  }

  if (config.name) {
    const { code, stack } = transformFile(config.name, config.write, config)
    formatOutput([{ code, stack, name: config.name }], config.stack)
    if (config.write) {
      console.log(chalk.green(`The writing is successful, the file name is '${config.name}'`))
    }
  }

  if (config.dir) {
    if (config.type) {
      config = merge(config, { type: config.type })
    }
    const message = await transformDirectory(config.dir as string, config)
    formatOutput(message, config.stack)
    if (config.write) {
      console.log(chalk.green(`The writing is successful, and the following path is '${config.dir}'`))
    }
  }
}
