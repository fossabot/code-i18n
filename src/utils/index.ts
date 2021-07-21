export function isContainChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str)
}

export function splice(str: string, start: number, end: number, r: string) {
  return str.slice(0, start) + r + str.slice(end)
}
