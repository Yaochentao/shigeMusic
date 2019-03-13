<template>
    <div class="player" v-if="playingList.length > 0">
        <transition name="normal">
          <div class="normal-player" v-if="fullScreen">
            <div class="background">
              <div class="filter"></div>
              <img :src="currentSong.al.picUrl" width="100%" height="100%">
            </div>
            <div class="top">
              <div class="back" @click="back">
                <i class="iconfont icon-sdf"></i>
              </div>
              <h1 class="title">{{currentSong.name}}</h1>
              <h2 class="subtitle">{{currentSong.ar[0].name}}</h2>
            </div>
            <div class="middle">
              <transition name="middleL">
                <div class="middle-l">
                  <div class="cd-wrapper">
                    <div class="cd">
                      <img :src="currentSong.al.picUrl" class="image">
                    </div>
                  </div>
                </div>
              </transition>
              <!-- <transition name="middleR">
                <scroll class="middle-r" ref="lyricList" v-show="currentShow === 'lyric'" :data="currentLyric && currentLyric.lines">
                  <div class="lyric-wrapper">
                    <div class="currentLyric" v-if="currentLyric">
                      <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines"
                        :key="line.key">
                        {{line.txt}}
                      </p>
                    </div>
                    <p class="no-lyric" v-if="currentLyric === null">{{upDatecurrentLyric}}</p>
                  </div>
                </scroll>
              </transition> -->
            </div>
            <div class="bottom">
              <div class="progress-wrapper">
                <span class="time time-l">0:00</span>
                <div class="progress-bar-wrapper">
                  <!-- <progress-bar :percent="percent" @percentChangeEnd="percentChangeEnd" @percentChange="percentChange"></progress-bar> -->
                </div>
                <span class="time time-r">4:10</span>
              </div>
              <div class="operators">
                <div class="icon i-left">
                  <i class="iconfont icon-icon--1"></i>
                </div>
                <div class="icon i-left">
                  <i class="iconfont icon-shangyiqu101"></i>
                </div>
                <div class="icon i-center">
                  <i class="iconfont icon-suspend_icon"></i>
                </div>
                <div class="icon i-right">
                  <i class="iconfont icon-xiayiqu101"></i>
                </div>
                <div class="icon i-right">
                  <i class="iconfont icon-shoucang"></i>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition name="mini">
          <div class="mini-player" v-if="!fullScreen" @click="open">
            <div class="icon">
              <img :src="currentSong.al.picUrl" width="40" height="40">
            </div>
            <div class="text">
              <h2 class="name">{{currentSong.name}}</h2>
              <div class="desc">{{currentSong.ar[0].name}}</div>
            </div>
            <div class="control">
              <!-- <progress-circle :radius="radius" :percent="percent">
                <i class="fa" :class="miniIcon"></i>
              </progress-circle> -->
            </div>
            <div class="control">
              <i class="iconfont icon-caidan-dakai"></i>
            </div>
          </div>
        </transition>
        <audio ref="audio" :src="musicUrl"></audio>
      </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    created() {
      
    },
    mounted() {},
    activated() {},
    methods: {
      back() {
        this.$store.commit('SET_FULL_SCREEN',false);
      },
      open() {
        this.$store.commit('SET_FULL_SCREEN',true);
      }
    },
    computed: {
      fullScreen() {
        return this.$store.state.fullScreen;
      },
      playingList() {
        return this.$store.state.playingList;
      },
      currentSong() {
        return this.$store.getters.currentSong;
      },
      musicUrl() {
        return 'https://music.163.com/song/media/outer/url?id='+this.currentSong.id+'.mp3'
      }
    },
    watch: {
      currentSong() {
        this.$nextTick(() => {
          console.log(this.$refs.audio)
          this.$refs.audio.play()
        })
      }
    },
    components: {

    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/variable';

  .normal-enter-active, .normal-leave-active {
      transition: all 0.4s;
      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
  }
  .normal-enter, .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0,-100px,0);
    
    }
    .bottom {
      transform: translate3d(0,100px,0);
    }
  }

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;

      .background {
        position: absolute;
        left: -50%;
        top: -50%;
        width: 300%;
        height: 300%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(30px);

        .filter {
          position: absolute;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.6;
        }

        .filterR {
          position: absolute;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.4;

          &.filterR-enter-active,
          &.filterR-leave-active {
            transition: all 0.3s
          }

          &.filterR-leave-to,
          &.filterR-enter {
            opacity: 0
          }

          &.filterR-leave {
            opacity: 0.4;
          }
        }
      }

      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;

          .icon-sdf {
            display: block;
            padding: 5px 9px;
            font-size: 26px;
            color: @color-theme-l;
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          padding-top: 10px;
          line-height: 20px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-large;
          font-weight: bold;
          color: @color-text-l;
        }

        .subtitle {
          width: 70%;
          margin: 0 auto;
          line-height: 20px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-small-x;
          color: @color-text-l;
        }
      }

      .middle {
        display: flex;
        align-items: center;
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          &.middleL-enter-active,
          &.middleL-leave-active {
            transition: all 0.3s
          }

          &.middleL-enter,
          &.middleL-leave-to {
            opacity: 0
          }

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;

              &.play {
                animation: rotate 20s linear infinite;
              }

              &.pause {
                animation-play-state: paused;
              }

              .image {
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
        }

        .middle-r {
          display: inline-block;
          position: absolute;
          top: 0;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;

          &.middleR-enter-active,
          &.middleR-leave-active {
            transition: all 0.2s;
          }

          &.middleR-enter,
          &.middleR-leave-to {
            opacity: 0;
          }

          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;

            .text {
              line-height: 40px;
              color: @color-text-ggg;
              font-size: @font-size-medium;

              &.current {
                color: #FFF;
              }
            }

            .no-lyric {
              line-height: 40px;
              margin-top: 60%;
              color: @color-text-ggg;
              font-size: @font-size-medium;
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;

          .time {
            color: @color-text-l;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;

            &.time-l {
              text-align: left;
            }

            &.time-r {
              text-align: right;
              color: @color-text-gg;
            }
          }

          .progress-bar-wrapper {
            flex: 1;
          }
        }

        .operators {
          display: flex;
          align-items: center;

          .icon {
            flex: 1;
            color: @color-theme-l;

            &.disable {
              color: @color-theme;
            }

            i {
              font-size: 30px;
            }

            .mode {
              font-size: 25px;
            }

            &.i-left {
              text-align: right;
            }

            &.i-center {
              padding: 0 20px;
              text-align: center;

              i {
                font-size: 40px;
              }
            }

            &.i-right {
              text-align: left;
            }

            .icon-like {
              color: @color-sub-theme;
            }
          }
        }
      }
    }

    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: rgba(255, 255, 255, 0.85);

      &.mini-enter-active,
      &.mini-leave-active {
        transition: all 0.4s
      }

      &.mini-enter,
      &.mini-leave-to {
        opacity: 0
      }

      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        overflow: hidden;

        .name {
          margin-bottom: 2px;
          line-height: 14px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-medium;
          color: @color-text;
        }

        .desc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: @font-size-small;
          color: @color-text;
        }
      }

      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;

        .icon-play-mini,
        .icon-pause-mini,
        .icon-playlist,
        .iconfont {
          font-size: 30px;
          color: @color-theme-d;
        }

        .iconfont {
          position: relative;
          left: -5px;
          top: -3px;
        }

        .fa-play {
          color: @color-theme-d;
          font-size: 14px;
          position: absolute;
          left: 12px;
          top: 8.5px;
        }

        .fa-stop {
          color: @color-theme-d;
          font-size: 12px;
          position: absolute;
          left: 11px;
          top: 10px;
        }
      }
    }
  }
</style>