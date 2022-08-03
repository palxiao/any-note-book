<!--
 * @Author: ShawnPhang
 * @Date: 2022-08-02 10:37:39
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-03 00:02:41
 * @site: book.palxp.com
-->
<template>
  <div class="wrap">
    <sidebar v-model="data" :height="'calc(100vh - 200px)'" class="sider" @clickNode="clickNode" />
    <el-card class="show-card">
      <el-button type="primary" @click="save">保存所有修改</el-button>
      <br /><br />
      文章链接: <input v-model="editData.link" type="text" />
    </el-card>
  </div>
</template>

<script>
import sidebar from '@/components/Sidebar.vue'
import { Card } from 'element-ui'
import api from '@/api'
export default {
  components: { sidebar, [Card.name]: Card },
  data() {
    return {
      data: [],
      editData: {},
    }
  },
  async created() {
    const { result } = await api.getTree()
    this.data = result
  },
  methods: {
    async save() {
      const res = await api.saveTree(this.data)
      console.log(res)
    },
    clickNode(data) {
      this.editData = data
    },
  },
}
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
}
.sider {
  flex: 1;
}
.show-card {
  flex: 1;
  white-space: pre-line;
}
</style>