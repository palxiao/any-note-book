<!--
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-03 11:32:34
 * @site: book.palxp.com
-->
<template>
  <div id="app">
    <!-- <nav class="nav">
      <router-link to="/">文章编辑器</router-link> |
      <router-link to="/about">项目设置</router-link>
    </nav> -->
    <el-radio-group v-model="routeName" class="nav" size="small" @change="changeTab">
      <el-radio-button label="/">文章编辑器</el-radio-button>
      <el-radio-button label="/about">项目设置</el-radio-button>
      <el-radio-button label="/tree">菜单管理(未完成)</el-radio-button>
      <el-radio-button label="/none">笔记管理</el-radio-button>
    </el-radio-group>
    <!-- <router-view /> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      routeName: '/',
    }
  },
  methods: {
    changeTab() {
      this.$router.push({ path: this.routeName })
    },
  },
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.nav {
  padding: 16px 0 20px 0;
}
</style>
