/*
 * @Author: ShawnPhang
 * @Date: 2022-07-27 14:15:01
 * @Description: 初始化项目（暂弃用，已改用 localstorage ）
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-01 11:29:21
 */
const fs = require('fs')

// 创建配置及目录
function createJson(cb) {
  fs.stat('data/', function (error, stats) {
    if (error) {
      fs.mkdir('data/', function (error) {
        createConfig(() => {
          cb()
        })
      })
    } else {
      checkJson((has) => {
        if (has) {
          cb()
        } else {
          createConfig(() => {
            cb()
          })
        }
      })
    }
  })
}
// 判断配置是否存在
function checkJson(cb) {
  fs.access('data/config.json', fs.constants.F_OK, (err) => {
    cb(!err) // err ? '不存在' : '存在'
  })
}
// 创建文件
function createConfig(cb) {
  fs.writeFile('data/config.json', '{}', function (error) {
    if (error) {
      console.log(error)
      return
    }
    console.log('创建配置文件成功')
    cb()
  })
}

// 读写数据
const handleJson = (text) => {
  return new Promise((resolve) => {
    createJson(() => {
      const fn = text ? 'writeFileSync' : 'readFileSync'
      try {
        const data = fs[fn]('data/config.json', text || 'utf8')
        resolve(data || text)
      } catch (err) {
        console.error(err)
      }
    })
  })
}

module.exports = handleJson
