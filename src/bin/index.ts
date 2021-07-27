import { Command } from 'commander'
import { keys } from 'lodash'
import { version } from '../../package.json'
import { CommandArgs } from '../interface'
import { exec } from './transform'

const program = new Command()

program.version(version, '-v, --version')

program.name('code-i18n').usage('[options]')

program
  .description('Convert your code to help you code quickly (internationalization)')
  .allowUnknownOption()
  .option('--config <path>', 'Specify the configuration file')
  .option('-c, --code <code>', 'Convert the specified code')
  .option('-n, --name <file name>', 'Convert the specified file')
  .option('-d, --dir <directory>', 'Convert files under the specified path')
  .option('-s, --stack <file name>', 'Specify the output location of the collected language pack (json)')
  .option(
    '-w, --write [path]',
    'Specify the write path (only used in --code and --name) or overwrite the current file',
    false
  )
  .option(
    '-t, --type <js | jsx | ts | tsx | vue>',
    'Specify the current code type, must be specified when using --code'
  )
  .option('--debug', 'Output more information for debugging the program', false)
  .action((command: Partial<CommandArgs> & { write: boolean | string }) => {
    if (isEmpty(command)) {
      program.outputHelp()
    } else {
      exec(command)
    }
  })
  .parse(process.argv)

function isEmpty(command: Partial<CommandArgs>) {
  return keys(command).length <= 1
}
