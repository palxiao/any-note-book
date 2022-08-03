/*
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-03 14:40:40
 * @site: book.palxp.com
 */
// const isDev = process.env.NODE_ENV === 'development'
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: isDev ? '/' : './',
  productionSourceMap: false,
  devServer: {
    port: 7777,
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'server/server.js',
      builderOptions: {
        // asar: false, // asar打包
        extraResources: {
          from: './template/',
          to: 'template',
        },
      },
    },
  },
})
