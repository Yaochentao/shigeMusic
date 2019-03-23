<template>
    <transition name="list-fade">
        <div v-show="ifShow" class="playing-list" @click="close">
            <div class="list-wrapper" @click.stop>
              <div class="list-header">
                <div class="play-mode-con"  @click='changeMode'>
                  <i :class="iconMode"></i>
                  <span class="play-mode-text">{{modeText}} ({{sequenceList.length}})</span>
                </div>
                <i @click="clearAllSongs" class="iconfont icon-qingkongshanchu"></i>
              </div>
              <scroll ref="listContent" class="list-content" :data="sequenceList">
                <transition-group name="list" tag="ul">
                  <li class="item" ref="listItem"
                  v-for="(item, index) in sequenceList" :key="item.id" @click="selectSong(index,item)">
                    <div class="text">
                      <i v-show="item.id === currentSong.id" class="iconfont icon-shengyinkai"></i>
                      <span class="song" :class="{active: item.id === currentSong.id}">{{item.name}}</span>
                      <span class="singer" :class="{active: item.id === currentSong.id}">- {{item.ar[0].name}}</span>
                    </div>
                    <span class="delete" @click.stop="deletSong(item)">
                      <i class="iconfont icon-guanbi"></i>
                    </span>
                  </li>
                </transition-group>
            </scroll>
            </div>
        </div>
    </transition>
</template>
<script>
import scroll from '../scroll'
export default {
    data() {
        return {
            ifShow: false
        }
    },
    methods: {
        show() {
            this.ifShow = true;
        },
        close() {
            this.ifShow = false;
        },
        changeMode() {
          const mode = (this.$store.state.mode + 1) % 3;
          this.$store.commit('SET_PALY_MODE',mode);
          let list = null;
          let _list = this.sequenceList.slice(0);   //此处对this.sequenceList进行深拷贝
          //   如直接将this.sequenceList传入shuffle函数会无意中修改state中的sequenceList
          if (mode === 2) {
            console.log('mode2')
            list = this.shuffle(_list);  //洗牌函数
          } else {
            console.log('mode01')
            list = _list
          }
          this.resetCurrentIndex(list);
          this.$store.commit('SET_PLAYLIST',list);
        },
        resetCurrentIndex(list) { //使模式切换时当前播放歌曲不变
          let index = list.findIndex((item) => {
            return item.id === this.$store.getters.currentSong.id
          });
          console.log(index)
          this.$store.commit('SET_CURRENT_INDEX',index);
        },
        clearAllSongs() {
          this.$store.dispatch('clearAllSongs');
        },
        selectSong(index,item) {
          if (this.$store.state.mode === 2) {
            // 随机模式下需先findIndex
            index = this.$store.state.playingList.findIndex((song) => {
              return song.id === item.id
            })
          }
          this.$store.commit('SET_CURRENT_INDEX',index);
        },
        deletSong(item) {
          this.$store.dispatch('deleteSong',item);
          console.log(item)
        },
        shuffle(arr) { //洗牌函数 即将数组打乱
          for (let i = 0; i< arr.length; i++) {
            let j = this.getRandomInt(0,i);
            let t =arr[i];
            arr[i] = arr[j];
            arr[j] = t;
          }
          return arr;
        },
        getRandomInt(min,max) {
          return Math.floor(Math.random()*(max - min +1)+min)
        }
    },
    computed: {
      sequenceList() {
        return this.$store.getters.getSequenceList;
      },
      currentSong() {
        return this.$store.getters.currentSong;
      },
      iconMode() {
        return this.$store.state.mode === 0 ? 'iconfont icon-xunhuanbofang' : this.$store.state.mode === 1 ? 'iconfont icon-danquxunhuan' : 'iconfont icon-icon--1';
      },
      modeText() {
        return this.$store.state.mode === 0 ? '列表循环' : this.$store.state.mode === 1 ? '单曲循环' : '随机播放';
      }
    },
    components: {
      scroll
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/variable';
.playing-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(0, 0, 0, 0.3);
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 57vh;
      border-radius: 8px;
      background-color: @color-background;
      .list-header{
        height: 7vh;
        width: 100%;
        border-bottom: 1px solid rgb(228, 228, 228);
        .play-mode-con {
          padding-left: 4vw;
          height: 7vh;
          display: inline-block;
          line-height: 7vh;
          .iconfont {
            color: @color-text-g;
          }
          .play-mode-text {
            margin-left: 2vw;
            font-size: @font-size-medium;
          }
        }
        .icon-qingkongshanchu {
          float: right;
          height: 7vh;
          line-height: 7vh;
          padding-right: 4vw;
        }
      } 
      .list-content{
        height: 50vh;
        overflow: hidden;
        .item {
          display: flex;
          height: 6.25vh;
          padding: 0 2vw;
          border-bottom: 1px solid rgb(228, 228, 228);
        }
        .text {
          display: inline-block;
          height: 6.25vh;
          line-height: 6.25vh;
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          .icon-shengyinkai {
            color: @color-theme;
            font-size: 17px;
            margin: 0 1vw;
          }
          .song {
            font-size: @font-size-medium;
          }
          .singer {
            font-size: @font-size-small-x;
            color: @color-text-g;
          }
          .active {
            color: @color-theme;
          }
        }
        .delete {
          width: 10vw;
          line-height: 6.25vh;
          text-align: center;
          color: @color-text-g;
        }
      }
    }
}
</style>


