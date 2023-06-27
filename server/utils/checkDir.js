/*
 * @Author: ShawnPhang
 * @Date: 2022-07-28 11:09:32
 * @Description: 检测文件夹是否存在，create：没有则立即创建
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-01 17:52:11
 */
module.exports = (path, create) => {
  const fs = require('fs')
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err) {
        create &&
          fs.mkdir(path, function (error) {
            if (error) {
              console.log(error)
              return false
            }
            // 目录不存在，创建成功
            resolve(true)
          })
        !create && reject(new Error('目录不存在'))
      } else {
        resolve(true)
      }
    })
  })
}
