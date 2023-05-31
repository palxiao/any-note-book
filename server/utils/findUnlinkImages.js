/*
 * @Author: ShawnPhang
 * @Date: 2023-05-31 17:34:18
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-05-31 20:37:44
 */
const path = require('path')
const fs = require('fs')

const { getResourcesPath } = require('./index')
const articlesPath = getResourcesPath() + '/docs/articles'
const imagesPath = getResourcesPath() + '/docs/images'

// const unlinkImages = [] // 需要删除的图片数组

const findUnlinkImages = async function () {
  const articles = await traversalDir(articlesPath)
  for (let i = 0; i < articles.length; i++) {
    const filename = articles[i]
    const filedir = path.join(articlesPath, filename)
    const stats = await fs.statSync(filedir) // 判断目标是否为文件
    if (stats.isFile()) {
      const md = fs.readFileSync(filedir, 'utf8')
      searchImage(md) // 检索出文章内的图片链接
    }
  }
  useImgs = [...new Set(useImgs)] // 去重，非必要
  const allNames = await traversalDir(imagesPath)
  const allImgs = await changeImages(allNames) // 获取全部图片
  for (const useImg of useImgs) {
    allImgs.splice(allImgs.indexOf(useImg), 1)
  }
  const diff = allImgs
  // let diff = allImgs.concat(useImgs)
  // diff = [...new Set(diff)]
  // diff = diff.filter((x) => !allImgs.includes(x) || !useImgs.includes(x)) // 取差集，最好是用 ES7 的 includes；ES6 可以用 Array.from结合Set；ES5 可以用 indexOf
  for (let i = 0; i < diff.length; i++) {
    fs.unlinkSync(diff[i].replace('../images', imagesPath)) // 删除文件
    // unlinkImages.push(diff[i].replace('../images', imagesPath))
  }
  console.log(`找到了 ${diff.length} 张无效图片`)
  // 获取全部图片的相对地址
  async function changeImages(res) {
    return res.map((x) => '../images/' + x)
  }

  // return unlinkImages // 此处应返回一个数组，如不明白，请仔细阅读题目
}

// 参考方法: 遍历文件列表
function traversalDir(path) {
  return new Promise((resolve) => {
    fs.readdir(path, async function (err, files) {
      if (!err) {
        resolve(files)
      }
    })
  })
}

let useImgs = []
/**
 * 参考方法: 正则提取文章内的全部图片链接
 * @param {string} md 传入的markdown文本内容
 * @returns 包含所有图片链接的数组
 */
function searchImage(md) {
  const pattern = /!\[(.*?)\]\((.*?)\)/gm
  let matcher
  while ((matcher = pattern.exec(md)) !== null) {
    if (matcher[2].indexOf('images') !== -1) {
      // 判断存在图片，matcher[2] 即为包含的链接
      useImgs.push(matcher[2])
    }
  }
  return useImgs
}

module.exports = findUnlinkImages // 请勿删除该行代码,否则影响判题!
