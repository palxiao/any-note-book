/*
 * @Author: ShawnPhang
 * @Date: 2022-07-27 23:45:30
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-03 10:17:41
 * @site: book.palxp.com
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
  文字计数: '<script src="//unpkg.com/docsify-count/dist/countable.js"></script>',
  图片缩放查看器: '<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>',
  代码复制到剪贴板: '<script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>',
}

const tempGenerate = (params) => {
  try {
    let _index = fs.readFileSync(`${getTemplatePath()}/pending/_index`, 'utf8') // 读取模板文件
    _index = _index.replace(/{{name}}/g, params.name)
    _index = _index.replace(/{{repo}}/g, params.repo)
    _index = _index.replace(/{{blog}}/g, generateData.blog(params.blog))
    _index = _index.replace(/{{juejin}}/g, generateData.juejin(params.juejin))
    let allPlugins = ''
    for (const plugin of params.plugin) {
      allPlugins += generateData[plugin]
    }
    _index = _index.replace(/{{plugins}}/g, allPlugins)
    fs.writeFileSync(`${getResourcesPath()}/docs/index.html`, _index) // 写入目标文件
  } catch (err) {
    console.error(err)
  }
}

module.exports = { tempGenerate }
