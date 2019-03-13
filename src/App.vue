<template>
  <div id="app">
    <i-header />
    <tab />
    <!-- keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染 -->
    <keep-alive> 
      <router-view/>
    </keep-alive>
    <player />
  </div>
</template>

<script>
import iHeader from './components/i-header/i-header'
import tab from './components/tab/tab'
import player from './components/player/player'
export default {
  components: {
    iHeader,
    tab,
    player
  }
}
</script>


<style lang="less">
@import './assets/variable';
body, html {
  line-height: 1;
  font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background: @color-background;
  color: @color-text;
}
#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
