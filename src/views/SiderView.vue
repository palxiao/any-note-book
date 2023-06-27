<!--
 * @Author: ShawnPhang
 * @Date: 2022-08-02 10:37:39
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-12-09 02:12:11
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
    document.removeEventListener('keydown', this._save)
    await this.save()
  },
  async created() {
    this.data = this.$store.getters.treeData
    if (!this.data || this.data.length <= 0) {
      const { result } = await api.getTree()
      this.data = result
    }
  },
  mounted() {
    this._save = (e) => {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.save()
      }
    }
    document.addEventListener('keydown', this._save)
  },
  methods: {
    async save() {
      await api.saveTree(this.data)
      this.$store.commit('setTreeData', this.data)
      this.$notify({
        title: '保存成功',
        type: 'success',
      })
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
