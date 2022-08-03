<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-27 22:58:33
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-03 10:36:55
 * @site: book.palxp.com
-->
<template>
  <el-dialog :width="width" :show-close="false" custom-class="web-view-dialog" :fullscreen="fullscreen" :visible.sync="centerDialogVisible" center @close="close">
    <slot />
    <template #title></template>
    <template #footer>
      <span v-if="footer && !fullscreen" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    footer: {
      default: true,
    },
    title: {},
    width: {},
    fullscreen: {},
  },
  data() {
    return {
      centerDialogVisible: false,
    }
  },
  methods: {
    open() {
      this.centerDialogVisible = true
    },
    close() {
      this.centerDialogVisible = false
      this.$emit('close')
    },
    justClose() {
      this.centerDialogVisible = false
    },
  },
}
</script>

<style lang="less">
.web-view-dialog {
  padding: 0;
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>