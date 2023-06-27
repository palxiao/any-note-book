/*
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-11 10:23:37
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    treeData: [],
  },
  getters: {
    treeData(state) {
      return state.treeData
    },
  },
  mutations: {
    setTreeData(state, data) {
      state.treeData = data
    },
  },
  actions: {},
  modules: {},
})
