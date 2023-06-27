/*
 * @Author: ShawnPhang
 * @Date: 2022-07-26 13:51:20
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-01 10:50:18
 */
const net = require('net')

// 检测端口是否被占用
function portIsOccupied(port, cb) {
  // 创建服务并监听该端口
  const server = net.createServer().listen(port)

  server.on('listening', function () {
    server.close() // 关闭服务
    cb(false)
  })

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      cb(true)
      console.log('The port【' + port + '】 is occupied, please change other port.')
    }
  })
}

function checkPort(port) {
  return new Promise((resolve, reject) => {
    portIsOccupied(port, (isOccupied) => {
      isOccupied ? reject(new Error('is fail')) : resolve()
    })
  })
}

module.exports = checkPort
