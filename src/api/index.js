/*
 * @Author: ShawnPhang
 * @Date: 2022-07-27 23:52:57
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-05-31 22:58:14
 */
function fetch(apiName, params) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest()
    request.open('POST', `${window._apiUrl}${apiName}`)
    // request.setRequestHeader("Content-Type", "multipart/form-data");
    // request.send(JSON.stringify(this.form))
    request.addEventListener('load', ({ currentTarget }) => {
      resolve(JSON.parse(currentTarget.response))
    })
    request.send(JSON.stringify(params))
  })
}

const pull = async (params) => {
  return await fetch('/pull', params)
}
const push = async () => {
  return await fetch('/push')
}
const saveTree = async (params) => {
  return await fetch('/save_tree', params)
}
const getTree = async () => {
  return await fetch('/list')
}
const postDetail = async (params) => {
  return await fetch('/detail', params)
}
const saveArticle = async (params) => {
  return await fetch('/save', params)
}
const delArticle = async (params) => {
  return await fetch('/del_article', params)
}

const saveImg = async (files) => {
  // return await fetch('/upload', params)
  return new Promise((resolve) => {
    const formData = new FormData()
    formData.append('file', files[0])
    const request = new XMLHttpRequest()
    request.open('POST', `${window._apiUrl}/upload`)

    request.addEventListener('load', ({ currentTarget }) => {
      resolve(JSON.parse(currentTarget.response))
    })
    request.send(formData)
  })
}

export default {
  pull,
  push,
  saveImg,
  saveTree,
  getTree,
  postDetail,
  saveArticle,
  delArticle,
}
