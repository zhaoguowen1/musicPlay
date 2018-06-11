import { commonParams } from './config'
import axios from 'axios'

export function getLyric(mid) {
  let url = '/api/lyric' // 后端代理的地址
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(), // +new Date() === Date.prototype.getTime()
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
