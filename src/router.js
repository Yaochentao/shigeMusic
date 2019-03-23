import Vue from 'vue'
import Router from 'vue-router'


import recommend from './components/recommend/recommend'
import playList from './components/playList/playList'
import search from './components/search/search'
import singer from './components/singer/singer'

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
    },
    {
      path: '/search',
      component: search
    },
    {
      path: '/singer',
      component: singer
    }
  ]
})
