<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:  
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-27 15:35:13
-->
<template>
  <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="80px">
    <el-collapse v-if="history.length > 0" v-model="active">
      <el-collapse-item title="快速载入历史仓库" :name="1">
        <div class="box-wrap">
          <div @click="select(item)" v-for="(item, i) in history" :key="'i' + i">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <b>{{ item.name }}</b>
                  <i>{{ item.repo }}</i>
                </div>
              </template>
              <div><b>Plugin</b>: {{ item.plugin + '' }}</div>
              <div v-if="item.blog"><b>Blog</b>: {{ item.blog }}</div>
              <div v-if="item.juejin"><b>Juejin</b>: {{ item.juejin }}</div>
            </el-card>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <br />
    <el-form-item label="项目标题">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item prop="repo" label="仓库名称">
      <el-input v-model="form.repo"></el-input>
    </el-form-item>
    <el-form-item label="插件开关">
      <el-checkbox-group v-model="form.plugin">
        <el-checkbox label="文字计数"></el-checkbox>
        <el-checkbox label="图片缩放查看器"></el-checkbox>
        <el-checkbox label="代码复制到剪贴板"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="博客地址">
      <el-input v-model="form.blog" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="掘金地址">
      <el-input v-model="form.juejin" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="Pages地址">
      <el-input v-model="form.pages" type="textarea"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(true)">保存并更新</el-button>
      <!-- <el-button @click="onSubmit(true)">强制更新</el-button> -->
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { Form, FormItem, Input, Checkbox, CheckboxButton, CheckboxGroup, Collapse, CollapseItem, Card } from 'element-ui'
import api from '@/api'
export default {
  components: { [Card.name]: Card, [Collapse.name]: Collapse, [CollapseItem.name]: CollapseItem, [Input.name]: Input, [Form.name]: Form, [FormItem.name]: FormItem, [Checkbox.name]: Checkbox, [CheckboxButton.name]: CheckboxButton, [CheckboxGroup.name]: CheckboxGroup },
  data() {
    return {
      loading: false,
      form: {
        name: 'Any-Note-Book',
        repo: '',
        plugin: [],
        blog: 'https://blog.palxp.com',
        juejin: 'https://juejin.cn/user/2682464103060541/posts',
        pages: '',
      },
      rules: {
        repo: [{ required: true, message: '仓库名称 (Repositories Name) 为必填，格式如 "yourname/xxxxxxx"，注意不要填错', trigger: 'blur' }],
      },
      history: [],
      active: 0,
    }
  },
  created() {
    const config = window.localStorage.getItem('config')
    this.form = config ? JSON.parse(config) : this.form
    const history = window.localStorage.getItem('history')
    this.history = history ? JSON.parse(history) : []
  },
  async mounted() {
    await this.$nextTick()
    this.$refs['form'].validate() // 进入页面后主动检测以触发提示
  },
  methods: {
    onSubmit(force) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (force) {
            this.loading = true
            await api.pull({ ...this.form, ...{ force } })
          }
          const index = this.history.findIndex((x) => x.repo === this.form.repo)
          index === -1 ? this.history.push(this.form) : (this.history[index] = this.form)
          window.localStorage.setItem('history', JSON.stringify(this.history))
          window.localStorage.setItem('config', JSON.stringify(this.form))
          setTimeout(() => {
            this.loading = false
            this.$router.push({ path: '/', query: { rebuild: 1 } })
          }, 300)
        } else {
          return false
        }
      })
      console.log(this.form)
    },
    select(data) {
      this.form = data
      this.active = 0
    },
  },
}
</script>

<style scoped>
.box-wrap {
  display: flex;
  flex-wrap: wrap;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card {
  min-width: 12rem;
  margin: 1.2rem;
  cursor: pointer;
}
.box-card:hover {
  transform: scale(1.1);
}
</style>
