import Vue from 'vue'
import Router from 'vue-router'


import recommend from './components/recommend/recommend'
import playList from './components/playList/playList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend
    },
    {
      path: '/playList',
      component: playList
    }
  ]
})
