/* eslint-disable max-nested-callbacks */
/*
 * @Author: ShawnPhang
 * @Date: 2022-07-27 10:10:55
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-03 16:33:22
 * @site: book.palxp.com
 */
const { getResourcesPath, getTemplatePath } = require('./utils/index')
const { tempGenerate } = require('./utils/generate')

const branch = 'main'
// const isDev = process.env.NODE_ENV === 'development'
const child_process = require('child_process')
const exec = child_process.exec
const checkDir = require('./utils/checkDir')

let params = {}
const pullRepository = async function (data) {
  params = data
  const name = data.repo
  const fullPath = getResourcesPath()
  const gitAddress = `git@github.com:${name}.git`
  const shell = `git clone -b ${branch} ${gitAddress} --depth 1 ${fullPath}`

  return new Promise((resolve, reject) => {
    if (!name) {
      reject(new Error('can not pull'))
      return
    }
    checkDir(fullPath)
      .then(() => {
        exec(`cd ${fullPath} && git pull origin ${branch}`, () => {
          // 拉取分支代码
          init(fullPath + '/docs').then(() => {
            resolve()
          })
          resolve()
        })
      })
      .catch(() => {
        exec(`rm -rf ${fullPath}`, () => {
          // 首次初始化项目
          exec(shell, function (error, stdout, stderr) {
            if (error) {
              console.log(error.stack)
              console.log('Error code: ' + error.code)
              reject(new Error(error))
              return
            }
            init(fullPath + '/docs').then(() => {
              resolve()
            })
            // console.log('使用exec方法输出: ' + stdout)
            // console.log(`stderr: ${stderr}`)
            // console.log(process.pid)
          })
        })
      })
  })
}

const init = async (path) => {
  return new Promise((resolve) => {
    checkDir(path)
      .then(() => {
        tempGenerate(params)
        resolve() // 判断是完整的项目
      })
      .catch(() => {
        // 不是完整的项目，执行文件的初始化
        exec(`cp -r ${getTemplatePath()}/complete/* ${getResourcesPath()}`, () => {
          tempGenerate(params)
          resolve()
        })
      })
  })
}

const pushRepository = function () {
  const message = 'feat: auto update'
  const fullPath = getResourcesPath()
  const sp = `cd ${fullPath} &&`

  return new Promise((resolve) => {
    exec(`${sp} git add . && git commit -m '${message}'`, (error, stdout, stderr) => {
      if (String(error) !== 'null') {
        resolve('没有可更新的提交')
        return
      }
      exec(`cd ${fullPath} && git push origin ${branch}`, (error, stdout, stderr) => {
        resolve(stdout)
      })
    })
  })
}

module.exports = { pullRepository, pushRepository }
