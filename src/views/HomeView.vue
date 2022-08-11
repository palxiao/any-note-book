<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-11 10:30:09
 * @site: book.palxp.com
-->
<template>
  <div class="home">
    <Editor ref="editor" v-model="value" v-loading="loading" element-loading-text="配置项目中，请稍候.." @save="saveArticle" />
    <div v-show="pagesUrl" class="footer">
      访问在线地址：<a @click="openLink">{{ pagesUrl }}</a>
    </div>
    <web-dialog ref="dialog" :title="false" :fullscreen="true" @keyup.esc="leaveWeb">
      <iframe class="web-view" :src="pagesUrl" frameborder="0"></iframe>
      <el-button type="info" class="close-btn" @click="leaveWeb">退出预览</el-button>
    </web-dialog>
    <web-dialog ref="listDialog" width="48%" :footer="false" title="选择笔记" @close="listClose">
      <sidebar v-model="data" :height="'50vh'" :edit="false" @clickNode="selectArticle" />
    </web-dialog>
    <div v-show="!curPath && !loading" class="select-mask"><el-button type="primary" @click="open">新建 / 打开笔记</el-button></div>
    <el-button v-show="curPath" class="exit-btn" type="info" @click="exit">关闭笔记</el-button>
  </div>
</template>

<script>
import webDialog from '@/components/common/Dialog.vue'
import Editor from '@/components/Editor.vue'
import sidebar from '@/components/Sidebar.vue'
import api from '@/api'

export default {
  name: 'HomeView',
  components: { Editor, webDialog, sidebar },
  data() {
    return {
      loading: false,
      value: '',
      curPath: null,
      pagesUrl: '',
      data: [],
    }
  },
  async created() {
    this.build()
  },
  activated() {
    const { rebuild } = this.$route.query
    rebuild && this.build()
    this.data = this.$store.getters.treeData
  },
  deactivated() {},
  methods: {
    build() {
      const config = window.localStorage.getItem('config') || '{}'
      const data = JSON.parse(config)
      if (!data.repo) {
        this.$router.push({ path: '/about' })
      } else {
        this.pull(data)
      }
      this.pagesUrl = data.pages
    },
    async pull(data) {
      this.loading = true
      await api.pull(data)
      const { result } = await api.getTree()
      this.$store.commit('setTreeData', result)
      this.data = result
      this.loading = false
      this.$notify({
        title: '初始化成功',
        message: '欢迎使用：' + data.name,
        type: 'success',
      })
    },
    // 新建 / 打开笔记
    async open() {
      // const { result } = await api.getTree() // 这里页面keepAlive重复输入新值会有问题，需将树改为状态管理
      // this.data = result
      this.$refs.listDialog.open()
    },
    async listClose() {
      await api.saveTree(this.data)
    },
    async selectArticle(node) {
      const { result } = await api.postDetail(node)
      node.link = result.path.split('/docs/')[1]
      await api.saveTree(this.data)
      this.curPath = result.path
      this.value = result.text
      this.$refs.listDialog.justClose()
    },
    async openLink() {
      this.pagesUrl = `${this.pagesUrl.split('?')[0]}?r=${new Date().getTime()}`
      this.$refs.dialog.open()
    },
    leaveWeb() {
      this.$refs.dialog.close()
    },
    async saveArticle() {
      const value = this.value.replaceAll(window._apiUrl + '/images', '../images')
      await api.saveArticle({ path: this.curPath, value })
      this.$message({
        message: '保存成功',
        type: 'success',
      })
      api.push()
    },
    async exit() {
      await this.saveArticle()
      this.curPath = null
      this.value = ''
    },
  },
}
</script>

<style lang="less" scoped>
.home {
  position: relative;
}
.footer {
  margin-top: 12px;
  font-size: 14px;
  a {
    font-weight: bold;
    cursor: pointer;
    color: #409eff;
  }
}
.web-view {
  width: 100%;
  height: calc(100vh - 10px);
}
.web-view::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.close-btn {
  position: fixed;
  bottom: 10px;
  z-index: 99999;
  right: 10px;
}
.select-mask {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% - 30px);
  background: rgba(255, 255, 255, 0.85);
}
.exit-btn {
  position: fixed;
  top: 20px;
  right: 10px;
}
</style>