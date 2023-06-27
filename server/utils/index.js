/*
 * @Author: ShawnPhang
 * @Date: 2022-08-01 11:28:21
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-11-02 09:53:20
 */
const path = require('path')
const fs = require('fs')
// const checkDir = require('./checkDir.js')

const getResourcesPath = () => {
  let thePath = ''
  switch (process.env.NODE_ENV) {
    case 'development':
      // basePath = path.join(__static, '/') // eslint-disable-line no-undef
      thePath = 'static'
      break
    case 'production':
      thePath = path.join(process.resourcesPath, './static')
      break
  }
  return thePath
}

const getTemplatePath = () => {
  let thePath = ''
  switch (process.env.NODE_ENV) {
    case 'development':
      thePath = 'template'
      break
    case 'production':
      thePath = path.join(process.resourcesPath, './template')
      break
  }
  return thePath
}

const saveTreeSidebar = (data) => {
  let sideText = ''
  function translate(data, level = 0) {
    for (const item of data) {
      !item.hide && (sideText += `${printBlankSpace(level)}* ${item.link ? `[${item.label}](${item.link})` : item.label}\r\n`)
      if (item.children) {
        translate(item.children, level + 1)
      }
    }
  }
  translate(data)
  fs.writeFileSync(`${getResourcesPath()}/docs/_sidebar.md`, sideText)
  fs.writeFileSync(`${getResourcesPath()}/docs/_sidebar.json`, JSON.stringify(data, null, 2))
}
const printBlankSpace = (num = 0) => {
  let val = ''
  for (let i = 0; i < num; i++) {
    val += '    '
  }
  return val
}

const getSidebarTree = () => {
  let txt = fs.readFileSync(`${getResourcesPath()}/docs/_sidebar.json`, 'utf8')
  return JSON.parse(txt)
}

const getArticleDetail = (link) => {
  let text = ''
  let path = ''
  if (link) {
    path = `${getResourcesPath()}/docs/${link}`
    text = fs.readFileSync(path, 'utf8')
  } else {
    path = `${getResourcesPath()}/docs/articles/${new Date().getTime()}.md`
    fs.writeFileSync(path, '')
  }
  return { text, path }
}

const saveArticle = ({ path, value }) => {
  fs.writeFileSync(`${path}`, value)
}

module.exports = {
  getResourcesPath,
  getTemplatePath,
  saveTreeSidebar,
  getSidebarTree,
  getArticleDetail,
  saveArticle,
}
