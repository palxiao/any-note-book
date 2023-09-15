/*
 * @Author: ShawnPhang
 * @Date: 2022-07-27 23:52:57
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-15 17:45:50
 */
function fetch(apiName, params = {}) {
  let config = window.localStorage.getItem('config')
  config = config ? JSON.parse(config) : {}
  return new Promise((resolve) => {
    const request = new XMLHttpRequest()
    request.open('POST', `${window._apiUrl}${apiName}`)
    // request.setRequestHeader("Content-Type", "multipart/form-data");
    // request.send(JSON.stringify(this.form))
    request.addEventListener('load', ({ currentTarget }) => {
      resolve(JSON.parse(currentTarget.response))
    })
    params.repo = config.repo // 指定仓库
    request.send(JSON.stringify(params))
  })
}

const pull = async (params) => {
  return await fetch('/pull', params)
}
const push = async () => {
  return await fetch('/push')
}
const saveTree = async (data) => {
  return await fetch('/save_tree', { data })
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
  let config = window.localStorage.getItem('config')
  config = config ? JSON.parse(config) : {}
  // return await fetch('/upload', params)
  return new Promise((resolve) => {
    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('repo', config.repo)
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
