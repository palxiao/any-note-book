/*
 * @Author: ShawnPhang
 * @Date: 2023-01-01 18:39:02
 * @Description: 创建文件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-15 17:29:56
 */
const fs = require('fs')
const { getResourcesPath, getTemplatePath } = require('./index')

const generateData = {
  blog: (link) => {
    return link ? `<a href="${link}">进入博客</a>` : ''
  },
  juejin: (link) => {
    return link
      ? `<a href="${link}"><img class="juejin"
    src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/7abc2b532f725d394feaf0141547ade7.svg" /></a>`
      : ''
  },
  文字计数: '<script src="https://npm.elemecdn.com/docsify-count/dist/countable.js"></script>',
  图片缩放查看器: '<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/docsify/4.12.2/plugins/zoom-image.min.js"></script>',
  代码复制到剪贴板: '<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/docsify-copy-code/2.1.1/docsify-copy-code.min.js"></script>',
}

const tempGenerate = (params) => {
  try {
    let _index = fs.readFileSync(`${getTemplatePath()}/pending/_index`, 'utf8') // 读取模板文件
    _index = _index.replace(/{{ name }}/g, params.name)
    _index = _index.replace(/{{ repo }}/g, params.repo)
    _index = _index.replace(/{{ blog }}/g, generateData.blog(params.blog))
    _index = _index.replace(/{{ juejin }}/g, generateData.juejin(params.juejin))
    let allPlugins = ''
    for (const plugin of params.plugin) {
      allPlugins += generateData[plugin]
    }
    _index = _index.replace(/{{ plugins }}/g, allPlugins)
    fs.writeFileSync(`${getResourcesPath(params.repo)}/docs/index.html`, _index) // 写入目标文件
  } catch (err) {
    console.error(err)
  }
}

module.exports = { tempGenerate }
