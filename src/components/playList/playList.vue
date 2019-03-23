<template>
  <transition name="slide" mode="out-in">
    <div class="music-list">
      <div class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont icon-sdf"></i>
        </div>
        <div class="text">
          <h1 class="title">{{headerTitle}}</h1>
        </div>
      </div>
      <scroll class="list" :data="listDetail.tracks" ref="list">
        <div class="music-list-wrapper">
          <div class="bg-image" :style="{backgroundImage: 'url(' + listDetail.coverImgUrl + ')'}">
            <div class="text">
              <h2 class="list-title">{{listDetail.name}}</h2>
              <p class="play-count" v-if="listDetail.playCount">
                <i class="iconfont icon-erji"></i>
                {{listDetail.playCount}}
              </p>
            </div>
          </div>
          <div class="song-list-wrapper">
            <div @click="playAll" class="sequence-play" v-show="listDetail.trackCount">
              <i class="iconfont icon-icon-1"></i>
              <span class="text">播放全部</span>
              <span class="count">(共{{listDetail.trackCount}}首)</span>
            </div>
            <song-list @select="selectItem" :songs="listDetail.tracks"></song-list>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import scroll from '../scroll'
  import songList from '../song-list/song-list'
  export default {
    data() {
      return {
        id: '',
        playCount: '',
        listDetail: {},
        headerTitle: '歌单'
      }
    },
    created() {
      console.log('created')
      // this.getId();

    },
    activated() {
      console.log('actived')
      this.getId();
    },
    methods: {
      getId() {
        this.id = this.$route.query.id;
        return this.getListDetail()
      },
      getListDetail() {
        this.$http.get('/playlist/detail?id=' + this.id)
          .then((res) => {
            this.listDetail = res.data.playlist;
          })
      },
      selectItem(item, index) {
        // console.log(index);
        this.$store.dispatch('selectPlay',{
          list: this.listDetail.tracks,
          index
        });
      },
      playAll() {
        this.$store.dispatch('selectPlay',{
          list: this.listDetail.tracks,
          index: 0
        });
      },
      back() {
        this.$router.push('/recommend')
      },
    },
    components: {
      scroll,
      songList
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/variable';

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.2s
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(30%, 0, 0);
    opacity: 0;
  }

  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;

    .header {
      position: fixed;
      top: 0;
      width: 100%;
      height: 44px;
      color: #fff;
      z-index: 100;

      // background: @color-theme;
      .back {
        margin: 0 10px 0 10px;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        line-height: 44px;

        .icon-sdf {
          display: inline-block;
          font-size: 22px;
        }
      }

      .text {
        display: inline-block;
        line-height: 44px;
        font-size: @font-size-medium-x;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: @color-background;

      .music-list-wrapper {
        .bg-image {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 75%;
          transform-origin: top;
          background-size: cover;
          background-position: 0 30%;
          background-repeat: no-repeat;
          .text {
            position: absolute;
            width: 80%;
            height: 40px;
            bottom: 50px;
            left: 15px;
            color: #fff;
            .play-count {
              position: absolute;
              bottom: -16px;
              font-size: @font-size-small;
              .icon-erji {
                font-size: 12px;
              }
            }

            .list-title {
              position: absolute;
              bottom: 0;
              font-size: @font-size-medium-x;
              line-height: 18px;
              font-weight: bold;
              letter-spacing: 1px;
            }
          }
        }

        .song-list-wrapper {
          padding: 41px 0 40px 0;
          border-radius: 10px;
          position: relative;
          top: -20px;
          background: @color-background;

          .sequence-play {
            position: absolute;
            // left: 8;
            top: 0px;
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            padding-left: 16px;
            border-bottom: 1px solid rgb(228, 228, 228);

            .iconfont {
              font-size: 18px;
              color: @color-text;
              padding-right: 14px;
            }

            .text {
              font-size: @font-size-medium-x;
            }

            .count {
              font-size: @font-size-medium;
              color: @color-text-g;
            }
          }
        }
      }
    }

  }
</style>