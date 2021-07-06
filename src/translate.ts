import request from 'request'
import CryptoJS from 'crypto-js'
import path from 'path'
const rootPath = path.join(__dirname, '../..')
const json = require(path.join(rootPath, 'locale/zh-cn.json'))

function truncate(q: string) {
  var len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

const run = (v: string) => {
  var appKey = '4b890a8255b97ae0'
  var key = 'E4426hoRNnOeiRiveXtvNvJJQ6I2gnuC'

  var salt = new Date().getTime()
  var curtime = Math.round(new Date().getTime() / 1000)
  var from = 'zh-CHS'
  var to = 'en'
  var str1 = appKey + truncate(v) + salt + curtime + key
  var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex)

  return new Promise<string[]>((resolve) => {
    request.post('http://openapi.youdao.com/api', {
      form: {
        q: v,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: 'v3',
        curtime: curtime,
      },
      callback: (error, res) => {
        const translation = JSON.parse(res.body).translation
        resolve(translation)
      },
    })
  })
}

export default async function translate(json: Record<string, string>) {
  const v = Object.values(json)

  let vJson: string[] = [],
    tp = ''
  v.forEach((item) => {
    tp += item + '\n'
    if (tp.length > 4000) {
      vJson.push(tp.slice(0, -1))
      tp = ''
    }
  })
  vJson.push(tp.slice(0, -1))

  const j = []
  while (vJson.length) {
    const json = vJson.shift()
    if (json) {
      const data = await run(json)
      const r = data[0].split('\n')
      const zh = json.split('\n').length
      if (r.length !== zh) {
        console.warn('translation error', r.length)
      } else {
        console.log('youdao', r.length, 'zh-cn', zh)
      }
      j.push(r)
    }
  }
  const r = j.flat()

  const rJson = Object.keys(json).reduce((pre: Record<string, string>, key, index) => {
    pre[key] = r[index]
    return pre
  }, {})

  console.log('rJson', Object.values(rJson).length)
  const source = require('prettier').format(JSON.stringify(rJson), {
    parser: 'json-stringify',
  })
  require('fs').writeFileSync(require('path').join(rootPath, 'locale/en-us.json'), source)
}
