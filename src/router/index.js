/*
 * @Author: ShawnPhang
 * @Date: 2022-07-26 22:25:43
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-08-02 16:27:22
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { keepAlive: true },
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import(/* webpackChunkName: "tree" */ '../views/SiderView.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
