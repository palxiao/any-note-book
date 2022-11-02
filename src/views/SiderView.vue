<!--
 * @Author: ShawnPhang
 * @Date: 2022-08-02 10:37:39
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-11-02 09:47:12
 * @site: book.palxp.com
-->
<template>
  <div class="wrap">
    <sidebar v-model="data" :height="'calc(100vh - 200px)'" class="sider" @clickNode="clickNode" />
    <el-card class="show-card">
      <br /><br />
      {{ editData.label }}<br />
      <br /><el-input v-show="editData.label" v-model="editData.link" type="text" />
    </el-card>
  </div>
</template>

<script>
import sidebar from '@/components/Sidebar.vue'
import { Card, Input } from 'element-ui'
import api from '@/api'
export default {
  components: { sidebar, [Card.name]: Card, [Input.name]: Input },
  data() {
    return {
      data: [],
      editData: {},
    }
  },
  async beforeDestroy() {
    await this.save()
  },
  async created() {
    const { result } = await api.getTree()
    this.data = result
  },
  methods: {
    async save() {
      await api.saveTree(this.data)
      this.$store.commit('setTreeData', this.data)
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