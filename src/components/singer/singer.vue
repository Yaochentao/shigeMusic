<template>
    <transition name="slide" mode="out-in">
        <div class="singer">
            <div class="header" ref="header">
                <div class="back" @click="back">
                    <i class="iconfont icon-sdf"></i>
                </div>
            </div>
            <scroll class="list" :data="hotSongs" ref="list">
                <div class="music-list-wrapper">
                    <div class="bg-image" :style="{backgroundImage: 'url(' + singerDetail.picUrl + ')'}">
                        <div class="text">
                        <h2 class="list-title">{{singerDetail.name}}</h2>
                        <p class="desc">{{singerDetail.briefDesc}}</p>
                        </div>
                    </div>
                    <div class="song-list-wrapper">
                        <song-list @select="selectItem" :songs="hotSongs"></song-list>
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
            singerDetail: {},
            hotSongs: []
        }
    },
    activated() {
        this.getId();
    },
    methods: {
        back() {
            this.$router.back();
        },
        getId() {
            this.id = this.$route.query.id;
            return this.getSinger();
        },
        getSinger() {
            this.$http.get(`/artists?id=${this.id}`)
            .then((res) => {
                this.singerDetail = res.data.artist;
                this.hotSongs = res.data.hotSongs;
                console.log(this.singerDetail.picUrl)
            })
        },
        selectItem(item, index) {
        // console.log(index);
        this.$store.dispatch('selectPlay',{
          list: this.hotSongs,
          index
        });
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
.singer {
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
            bottom: 32px;
            left: 15px;
            color: #fff;
            .list-title {
              font-size: @font-size-medium-x;
              line-height: 18px;
              font-weight: bold;
              letter-spacing: 1px;
            }
            .desc {
                font-size: @font-size-small-x;
                color: @color-theme-l;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
          }
        }

        .song-list-wrapper {
          padding: 10px 0 40px 0;
          border-radius: 10px;
          position: relative;
          top: -20px;
          background: @color-background;
        }
      }
    }
}
</style>


