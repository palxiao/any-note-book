<!--
 * @Author: ShawnPhang
 * @Date: 2022-08-02 11:12:06
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-11-02 09:45:10
 * @site: book.palxp.com
-->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>笔记目录</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="() => append()">新建目录/笔记</el-button>
    </div>
    <div class="content" :style="{ height }">
      <el-tree :data="data" draggable :node-key="NODE_KEY" default-expand-all :expand-on-click-node="false" @node-click="clickNode">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <div style="flex: 1">
            <input v-if="node.isEdit" :ref="'slotTreeInput' + data[NODE_KEY]" v-model="data.label" type="text" @blur.stop="editDone(node, data)" /> <span v-else class="item-label">{{ node.label }} <img v-if="data.hide" :src="require('@/assets/hide.svg')" /><img v-else-if="data.link || node.link" :src="require('@/assets/book.svg')" /></span> <el-button v-show="node.isEdit" type="text" size="mini" @click.stop="() => editDone(node, data)"> 确定 </el-button>
          </div>
          <span class="options">
            <el-button v-if="!edit" type="text" size="mini" @click.stop="() => openNode(data)"> 打开 </el-button>
            <el-button v-if="!data.link" type="text" size="mini" @click.stop="() => append(data)"> 新增笔记 </el-button>
            <el-button v-else type="text" size="mini" @click.stop="() => handleStatus(data)"> {{ data.hide ? '恢复显示' : '隐藏' }} </el-button>
            <el-button type="text" size="mini" @click.stop="() => handleEdit(node, data)"> 重命名 </el-button>
            <el-button v-if="edit" type="text" style="color: #f56c6c" size="mini" @click.stop="() => remove(node, data)"> 删除 </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </el-card>
</template>

<script>
import { Tree, Card } from 'element-ui'
import { nanoid } from 'nanoid'

export default {
  components: {
    [Tree.name]: Tree,
    [Card.name]: Card,
  },
  props: {
    height: {},
    value: {},
    edit: {
      default: true,
    },
  },
  data() {
    return {
      NODE_KEY: 'id',
      data: [],
    }
  },
  watch: {
    value(newVal) {
      if (JSON.stringify(this.data) !== JSON.stringify(newVal)) {
        this.data = newVal
      }
    },
    data: {
      handler() {
        if (this.data.length > 0) {
          this.$emit('input', this.data)
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.data = JSON.parse(JSON.stringify(this.value))
  },
  methods: {
    clickNode(data, node, e) {
      this.edit && this.$emit('clickNode', data)
    },
    openNode(data) {
      this.$emit('clickNode', data)
    },
    append(data) {
      const newChild = { id: nanoid(), label: '新建目录/笔记', children: [] }
      if (data && !data.children) {
        this.$set(data, 'children', [])
      }
      if (data) {
        data.children.push(newChild)
      } else {
        this.data.push(newChild)
      }
      console.log(this.data)
    },
    handleEdit(_node, _data) {
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs['slotTreeInput' + _data[this.NODE_KEY]].focus()
        }
      })
    },
    handleStatus(data) {
      // 设置编辑状态
      this.$set(data, 'hide', !data.hide)
    },
    editDone(node, data) {
      this.$set(node, 'isEdit', false)
    },
    remove(node, data) {
      this.$confirm('删除后无法恢复(但不会删除对应笔记)，确定删除？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex((d) => d.id === data.id)
          children.splice(index, 1)
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  // height: calc(100vh - 200px);
  overflow-y: scroll;
}
.item-label {
  display: flex;
  align-items: center;
  img {
    margin-left: 0.5em;
    width: 17px;
    height: 16px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  font-size: 14px;
  padding: 0 5px;
  .options {
    opacity: 0;
  }
}
.custom-tree-node:hover {
  .options {
    opacity: 1;
  }
}
</style>