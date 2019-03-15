<template>
    <div class="progress-bar" ref="progressBar">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
const progressBtnWidth = 16;
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    watch: {
        percent(newPercent) {
            if(newPercent >= 0) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                const offsetWidth = newPercent*barWidth; //偏移宽度
                // console.log(this.$refs.progress);
                this.$refs.progress.style.width = `${offsetWidth}px`;
                console.log(this.$refs.progressBtn.style.transform);
                this.$refs.progressBtn.style.transform = `translate2d(${offsetWidth}px,0,0)`
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '../assets/variable';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 5px solid @color-theme-l;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>


