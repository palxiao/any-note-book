/*
 * @Author: ShawnPhang
 * @Date: 2022-12-07 08:10:46
 * @Description: 图片压缩
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-05-31 17:17:26
 * @site: book.palxp.com
 */
// const Https = require('https')
// const Url = require('url')
// const fs = require('fs')
const images = require('images') // 版本锁定3.2.3
const sizeOf = require('image-size')

const minImage = async (stream, path) => {
  try {
    const file = await streamToBuffer(stream)
    const { width } = sizeOf(file)
    images(file)
      .size(width > 850 ? 900 : width)
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
