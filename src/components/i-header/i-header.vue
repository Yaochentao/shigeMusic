<template>
    <div class="i-header">
    <h1 class="text">shigeMusic</h1>
    <router-link to="/user" class="mine" tag="div">
     <i class="iconfont icon-htmal5icon35"></i>
    </router-link>
    <router-link to="/search" class="search" tag="div">
      <i class="iconfont icon-sousuo"></i>
    </router-link>
  </div>
</template>
<script>
export default {
    
}
</script>

<style lang="less" scoped>
@import '../../assets/variable';

.i-header {
  position: relative;
  height: 44px;
  width: 100%;
  text-align: center;
  background: @color-theme;
  z-index: 100;
  .text {
    line-height: 44px;
    font-weight: bold;
    color: @color-text-l;
    letter-spacing: 3px;
  }
  .mine {
    position: absolute;
    top: -6.5px;
    left: 0;
    .iconfont {
        display: block;
        padding: 11px;
        font-size: 22px;
        color: @color-theme-l;
    }
  }
  .search {
    position: absolute;
    top: -4px;
    right: 2px;
    .iconfont {
        display: block;
        padding: 12px;
        font-size: 19px;
        color: @color-theme-l;
    }
  }
}
</style>


