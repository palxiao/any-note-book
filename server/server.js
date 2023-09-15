/*
 * @Author: ShawnPhang
 * @Date: 2022-07-26 14:51:59
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-15 18:07:31
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

// let basePath = getResourcesPath()

// 创建http server，并传入回调函数:
const server = http.createServer(async function (request, response) {
  // console.log('__dirname : ' + __dirname)
  // 设置跨域允许
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', '*')
  response.setHeader('Access-Control-Allow-Methods', '*')

  const isPost = request.method === 'POST' && request.headers['content-type'].indexOf('form-data') === -1
  const params = isPost ? await getParams(request) : {}

  if (request.url === '/list') {
    findUnlinkImages(params.repo)
    // 获取文章树
    setJson(response, getSidebarTree(params))
  } else if (request.url === '/detail') {
    // 如果文章存在，则获取文章，否则新建文章
    setJson(response, getArticleDetail(params))
  } else if (request.url === '/save') {
    // 保存文章
    setJson(response, saveArticle(params))
  } else if (request.url === '/pull') {
    // 拉取项目
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
    saveTreeSidebar(params)
    pushRepository().then((res) => {
      setJson(response, res)
    })
  } else if (request.url === '/del_article') {
    // 删除文章
    const basePath = getResourcesPath(params.repo)
    fs.unlinkSync(basePath + '/docs/' + params.link) // 删除文件
    setJson(response, { msg: '删除成功' })
  } else if (request.url === '/upload') {
    // 上传图片
    const form = new multiparty.Form()
    form.parse(request, async function (err, fields, files) {
      const basePath = getResourcesPath(fields.repo)
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
    const repo = request.url.split('/images/')[0]
    const fileName = request.url.split('/images/')[1]
    const stream = fs.createReadStream(path.join(getResourcesPath(repo), './docs/images/' + fileName))
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
