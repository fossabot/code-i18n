export function isContainChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str)
}
