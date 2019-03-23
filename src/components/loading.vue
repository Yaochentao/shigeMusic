<template>
    <div class="loading">
        <p class="text">努力加载中..</p>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
@import '../assets/variable';
.loading {
    width: 100%;
    height: 5vh;
    .text {
        font-size: @font-size-small-x;
        color: @color-text-g;
        text-align: center;
        height: 5vh;
        line-height: 5vh;
    }
}
</style>


