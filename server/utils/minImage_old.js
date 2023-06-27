/*
 * @Author: ShawnPhang
 * @Date: 2022-12-07 08:10:46
 * @Description: 图片压缩
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-05-31 16:36:19
 */
const Https = require('https')
const Url = require('url')
const fs = require('fs')

const minImage = async (stream, path) => {
  const file = await streamToBuffer(stream)
  const obj = await UploadImg(file)
  const data = await DownloadImg(obj.output.url)
  fs.writeFileSync(path, data, 'binary')
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = []
    stream.on('error', reject)
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  })
}

function RandomHeader() {
  const ip = new Array(4)
    .fill(0)
    .map(() => parseInt(Math.random() * 255, 10))
    .join('.')
  return {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Postman-Token': Date.now(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
      'X-Forwarded-For': ip,
    },
    hostname: 'tinypng.com',
    method: 'POST',
    path: '/web/shrink',
    rejectUnauthorized: false,
  }
}

function UploadImg(file) {
  const opts = RandomHeader()
  return new Promise((resolve, reject) => {
    const req = Https.request(opts, (res) =>
      res.on('data', (data) => {
        const obj = JSON.parse(data.toString())
        obj.error ? reject(obj.message) : resolve(obj)
      }),
    )
    req.write(file, 'binary')
    req.on('error', (e) => reject(e))
    req.end()
  })
}

function DownloadImg(url) {
  const opts = new Url.URL(url)
  return new Promise((resolve, reject) => {
    const req = Https.request(opts, (res) => {
      let file = ''
      res.setEncoding('binary')
      res.on('data', (chunk) => (file += chunk))
      res.on('end', () => resolve(file))
    })
    req.on('error', (e) => reject(e))
    req.end()
  })
}

module.exports = { minImage }
