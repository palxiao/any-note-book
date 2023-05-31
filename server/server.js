/*
 * @Author: ShawnPhang
 * @Date: 2022-07-26 14:51:59
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-05-31 20:21:55
 * @site: book.palxp.com
 */
// 导入http模块:
const http = require('http')
const path = require('path')
// const url = require('url')
const fs = require('fs')
// const formidable = require('formidable')
const multiparty = require('multiparty')
// const querystring = require('querystring')
const checkPort = require('./utils/checkPortIsOccupied')
const { getResourcesPath } = require('./utils/index')
const { pullRepository, pushRepository } = require('./shell')
const { saveTreeSidebar, getSidebarTree, getArticleDetail, saveArticle } = require('./utils/index')
const { minImage } = require('./utils/minImage')
const findUnlinkImages = require('./utils/findUnlinkImages')

let basePath = getResourcesPath()

// 创建http server，并传入回调函数:
const server = http.createServer(async function (request, response) {
  // console.log('__dirname : ' + __dirname)
  // console.log(request.method + ': ' + request.url)
  // 设置跨域允许
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', '*')
  response.setHeader('Access-Control-Allow-Methods', '*')

  if (request.url === '/list') {
    findUnlinkImages()
    // 获取文章树
    setJson(response, getSidebarTree())
  } else if (request.url === '/detail') {
    // 如果文章存在，则获取文章，否则新建文章
    const { link } = await getParams(request)
    setJson(response, getArticleDetail(link))
  } else if (request.url === '/save') {
    // 保存文章
    setJson(response, saveArticle(await getParams(request)))
  } else if (request.url === '/pull') {
    // 拉取项目
    const params = await getParams(request)
    pullRepository(params).then(() => {
      setJson(response, { msg: '初始化项目成功' })
    })
  } else if (request.url === '/push') {
    // 提交/保存项目
    pushRepository().then((res) => {
      setJson(response, res)
    })
  } else if (request.url === '/save_tree') {
    // 保存文章树
    const params = await getParams(request)
    saveTreeSidebar(params)
    pushRepository().then((res) => {
      setJson(response, res)
    })
  } else if (request.url === '/upload') {
    // 上传图片
    const form = new multiparty.Form()
    form.parse(request, async function (err, fields, files) {
      const file = files.file[0]
      const reader = fs.createReadStream(file.path)
      const date = new Date()
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getTime()}`
      const name = dateStr + '.' + file.originalFilename.split('.').pop().toLowerCase() || 'jpg'
      const stream = fs.createWriteStream(path.join(basePath, './docs/images/' + name))
      reader.pipe(stream)
      await minImage(reader, path.join(basePath, './docs/images/' + name))
      setJson(response, { path: '/images/' + name })
    })
  } else if (request.url.indexOf('/images/') !== -1) {
    const fileName = request.url.split('/images/')[1]
    const stream = fs.createReadStream(path.join(basePath, './docs/images/' + fileName))
    response.setHeader('content-type', `images/${stream.path.split('.').pop() || 'jpg'}`)
    stream.pipe(response)
  }
})

const setJson = (response, result) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(
    JSON.stringify({
      code: 200,
      result,
    }),
  )
}

const getParams = (request) => {
  return new Promise((resolve) => {
    let postParams = ''
    request.on('data', (parmas) => {
      postParams += parmas
    })
    request.on('end', () => {
      resolve(postParams ? JSON.parse(postParams) : postParams)
    })
  })
}

// listen
function startServer(port = 3366) {
  checkPort(port)
    .then(() => {
      server.listen(port)
      window._apiUrl = `http://127.0.0.1:${port}`
    })
    .catch(() => {
      startServer(port + 1)
    })
}

startServer()
