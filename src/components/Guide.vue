<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-11 11:02:34
 * @site: book.palxp.com
-->
<template>
  <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="80px">
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
      <el-button type="primary" @click="onSubmit(false)">立即保存</el-button>
      <el-button @click="onSubmit(true)">强制更新</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { Form, FormItem, Input, Checkbox, CheckboxButton, CheckboxGroup } from 'element-ui'
import api from '@/api'
export default {
  components: { [Input.name]: Input, [Form.name]: Form, [FormItem.name]: FormItem, [Checkbox.name]: Checkbox, [CheckboxButton.name]: CheckboxButton, [CheckboxGroup.name]: CheckboxGroup },
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
        repo: [{ required: true, message: '仓库名称为必填，如 "yourname/xxxxxxx" ', trigger: 'blur' }],
      },
    }
  },
  created() {
    const config = window.localStorage.getItem('config')
    this.form = config ? JSON.parse(config) : this.form
  },
  methods: {
    onSubmit(force) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (force) {
            this.loading = true
            await api.pull({ ...this.form, ...{ force } })
          }
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
  },
}
</script>