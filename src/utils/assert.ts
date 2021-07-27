import chalk from 'chalk'

export function log(...message: any[]) {
  console.log(`${chalk.blue(`[${Date.now()}] [Log] Debug `)}`, ...message)
}
