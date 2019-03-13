<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/friend">
      <span>朋友</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/broadcast">
      <span>电台</span>
    </router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
@import '../../assets/variable';

.tab {
  display: flex;
  line-height: 44px;
  height: 44px;
  width: 100%;
  font-size: @font-size-medium;
  background: @color-theme;
  .tab-item {
    // 如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）
    flex: 1;
    // 垂直
    text-align: center;
    color: @color-text-lm;
    span {
      // display: inline-block;
      padding-bottom: 3px;
    }
    &.router-link-active {
      span {
        font-weight: bold;
        color: @color-text-l;
        border-bottom: 2px solid @color-text-l
      }
    }
  }
}
</style>
