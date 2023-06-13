/*
 * @Author: ShawnPhang
 * @Date: 2023-06-01 23:19:20
 * @Description: 本地图片压缩
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-12 15:31:16
 */
// const Https = require('https')
// const Url = require('url')
// const fs = require('fs')
const images = require('images') // 如遇问题尝试版本锁定到3.2.3
const sizeOf = require('image-size')

const minImage = async (stream, path) => {
  try {
    const file = await streamToBuffer(stream)
    const { width } = sizeOf(file)
    images(file)
      .size(width > 950 ? 1080 : width)
      .save(path, { quality: 75 })
  } catch (error) {
    console.log('图片未压缩')
  }
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = []
    stream.on('error', reject)
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  })
}

module.exports = { minImage }
