<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-25 17:56:41
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-15 18:13:13
-->
<template>
  <Editor v-bind="options" :value="content" :plugins="plugins" @change="handleChange" />
</template>

<script>
import 'bytemd/dist/index.min.css'
import 'juejin-markdown-themes/dist/juejin.min.css'
import 'highlight.js/styles/github.css'

import { Editor } from '@bytemd/vue'
import zhHans from 'bytemd/locales/zh_Hans.json'
import breaks from '@bytemd/plugin-breaks'
import highlight from '@bytemd/plugin-highlight'
import footnotes from '@bytemd/plugin-footnotes'
import frontmatter from '@bytemd/plugin-frontmatter'
import gfm from '@bytemd/plugin-gfm'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'
import mermaid from '@bytemd/plugin-mermaid'
import api from '@/api'

const uploadImages = async (files) => {
  const res = await api.saveImg(files)
  let config = window.localStorage.getItem('config')
  config = config ? JSON.parse(config) : {}
  return [{ url: window._apiUrl + `/${config.repo}` + res.result.path, alt: '' }]
}

let timer = null

const plugins = [
  gfm(),
  breaks(),
  footnotes(),
  frontmatter(),
  gemoji(),
  highlight(),
  mediumZoom(),
  mermaid(),
  // Add more plugins here
]

export default {
  components: { Editor },
  props: {
    value: {},
  },
  data() {
    return { content: '', options: { locale: zhHans, uploadImages }, plugins }
  },
  watch: {
    value() {
      // this.content !== this.value && (this.content = this.value)
      if (this.content !== this.value) {
        let config = window.localStorage.getItem('config')
        config = config ? JSON.parse(config) : {}
        const value = this.value.replaceAll('](../images', '](' + window._apiUrl + `/${config.repo}/images`)
        this.content = value
      }
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        this.$emit('save', true)
      }, 30000)
    },
    content() {
      this.$emit('input', this.content)
    },
  },
  mounted() {
    this._save = (e) => {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.$emit('save', false)
      }
    }
    document.addEventListener('keydown', this._save)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this._save)
  },
  methods: {
    handleChange(v) {
      this.content = v
    },
    save(e) {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.$emit('save', false)
      }
    },
    // setValue(v) {
    //   this.content = v
    // },
  },
}
</script>

<style>
.bytemd {
  height: calc(100vh - 120px);
}
</style>
