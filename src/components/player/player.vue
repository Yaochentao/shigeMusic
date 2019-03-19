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
            <div class="middle" 
                 @touchstart.prevent="middleTouchStart"
                 @touchmove.prevent="middleTouchMove"
                 @touchend="middleTouchEnd"
            >
              <!-- <transition name="middleL"> -->
                <div class="middle-l" ref="middleL">
                  <div class="cd-wrapper">
                    <div class="cd" :class="cdClass">
                      <img :src="currentSong.al.picUrl" class="image">
                    </div>
                  </div>
                  <div style="width: 100%;height: 50px;"></div>
                </div>
              <!-- </transition> -->
              
              <!-- currentLyric不为空时传入 -->
              <scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref="lyricList"> 
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p ref="lyricLine"
                       class="text"
                       :class="{'current':currentLineNum === index}"
                       v-for="(line,index) in currentLyric.lines"
                       :key="line.key">{{line.txt}}</p>
                  </div>
                </div>
              </scroll>
              
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
              <div class="dot-wrapper">
                <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar :percent="percent" @percentChange="onProgressBarChange"/>
                </div>
                <span class="time time-r">{{format(duration)}}</span>
              </div>
              <div class="operators">
                <div class="icon i-left">
                  <i :class="iconMode" @click='changeMode'></i>
                </div>
                <div class="icon i-left">
                  <i @click="prev" class="iconfont icon-shangyiqu101"></i>
                </div>
                <div class="icon i-center" @click="togglePlay">
                  <i :class="playIcon"></i>
                </div>
                <div class="icon i-right">
                  <i @click="next" class="iconfont icon-xiayiqu101"></i>
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
              <img :class="cdClass" :src="currentSong.al.picUrl" width="40" height="40">
            </div>
            <div class="text">
              <h2 class="name">{{currentSong.name}}</h2>
              <div class="desc">{{currentSong.ar[0].name}}</div>
            </div>
            <div class="control">
              <i :class="playIcon" @click.stop="togglePlay"></i>
              <!-- <progress-circle :radius="radius" :percent="percent">
                <i class="fa" :class="miniIcon"></i>
              </progress-circle> -->
            </div>
            <div class="control">
              <i class="iconfont icon-caidan-dakai"></i>
            </div>
          </div>
        </transition>
        <audio @ended="end" @canplay="getduration" @timeupdate="updateTime" ref="audio" :src="musicUrl"></audio>
      </div>
</template>

<script>
import progressBar from '../progress-bar'
import Lyric from 'lyric-parser'
import Scroll from '../scroll'
import { setTimeout } from 'timers';
  export default {
    data() {
      return {
        currentTime: 0,
        duration: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd'
      }
    },
    created() {},
    mounted() {
    },
    activated() {},
    methods: {
      back() {
        this.$store.commit('SET_FULL_SCREEN',false);//关闭全屏播放器
      },
      open() {
        this.$store.commit('SET_FULL_SCREEN',true); //打开全屏播放器
      },
      togglePlay() { //播放/暂停
        this.$store.commit('SET_PLAYING_STATE',!this.playing);
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }

      },
      end() {
        if(this.$store.state.mode === 1) {
          this.loop();   //单曲循环使调用loop方法
        } else {
          this.next();
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if(this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      next() {
        let index = this.currentIndex + 1;
        if(this.currentIndex === this.playingList.length - 1) {
          index = 0;
        }
        this.$store.commit('SET_CURRENT_INDEX',index);
        if(!this.playing) {
          this.togglePlay()
        }
      },
      prev() {
        let index = this.currentIndex - 1;
        if(this.currentIndex === 0) {
          index = this.playingList.length -1;
        }
        this.$store.commit('SET_CURRENT_INDEX',index);
        if(!this.playing) {
          this.togglePlay()
        }
      },
      getduration() {
        console.log(this.$refs.audio.duration);
        this.duration = this.$refs.audio.duration;
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime;  //获取audio当前播放时间
      },
      format(interval) { //audio时间戳格式化
        interval = interval | 0; //取整
        const minute = interval/60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`;
      },
      changeMode() {
        const mode = (this.$store.state.mode + 1) % 3;
        this.$store.commit('SET_PALY_MODE',mode);
        let list = null;
        if (mode === 2) {
          // console.log(this.$store.state.sequenceList)
          list = this.shuffle(this.$store.state.sequenceList);
        } else {
          list = this.$store.state.sequenceList;
        }
        // this._resetCurrentIndex(list);
        this.$store.commit('SET_PLAYLIST',list);
      },
      // _resetCurrentIndex(list) { //使模式切换时当前播放歌曲不变
      //   let idnex = list.findIndex((item) => {
      //     return item.id === this.currentSong.id
      //   });
      //   this.$store.commit('SET_CURRENT_INDEX',index);
      // },
      onProgressBarChange(percent) {
        const currentTime = this.duration * percent;
        this.$refs.audio.currentTime = currentTime;
        if(this.currentLyric) {
          this.currentLyric.seek(currentTime*1000)
        }
      },
      getLyric() {
        this.$http.get('/lyric?id='+this.currentSong.id)
        .then((res) => {
          this.currentLyric = new Lyric(res.data.lrc.lyric,this.handleLyric);
          console.log(this.currentLyric)
          if(this.playing) {
            console.log('play')
            this.currentLyric.play();
          }
        })
      },
      handleLyric({lineNum,txt}) {  //歌词播放时歌词每一行改变时的回调
        console.log(lineNum);
        this.currentLineNum = lineNum;
        if(lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        }else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        
      },
      middleTouchStart(e) {
        this.touch.initiated = true; //设置表示touch开始的标志位initiated 判断是否是一次滑动
        this.touch.moved = false;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e) {
        if(!this.touch.initiated) {
          return
        }
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        if(Math.abs(deltaY) > Math.abs(deltaX)) {  //纵向滚动距离大于横向滚动距离时return
          return
        }
        if(!this.touch.moved) {
          this.touch.moved = true;
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style.webkitTransform = `translate3d(${offsetWidth}px,0,0)`;

        this.$refs.lyricList.$el.style.transitionDuration = `0ms`;
        this.$refs.lyricList.$el.style.webkitTransitionDuration = `0ms`;

        this.$refs.middleL.style.opacity = 1- this.touch.percent;
        this.$refs.middleL.style.transitionDuration = `0ms`;
      },
      middleTouchEnd() {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth;
        let opacity;
        if(this.currentShow === 'cd') {
          if(this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        } else {
          if(this.touch.percent < 0.9) {
            offsetWidth = 0;
            this.currentShow = 'cd'
            opacity = 1;
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style.webkitTransform = `translate3d(${offsetWidth}px,0,0)`;

        this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`;
        this.$refs.lyricList.$el.style.webkitTransitionDuration = `${time}ms`;

        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style.transitionDuration = `${time}ms`;
      },
      _pad(num, n=2) {  //补零
        let len = num.toString().length;
        while(len < n) {
          num = '0' + num;
          len++;
        };
        return num;
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
      playIcon() {
        return this.playing ? 'iconfont icon-suspend_icon' : 'iconfont icon-icon-1'
      },
      iconMode() {
        return this.$store.state.mode === 0 ? 'iconfont icon-xunhuanbofang' : this.$store.state.mode === 1 ? 'iconfont icon-danquxunhuan' : 'iconfont icon-icon--1';
      },
      cdClass() {
        return this.playing ? 'play' : 'play pause'
      },
      fullScreen() {
        return this.$store.state.fullScreen;
      },
      playingList() {
        return this.$store.state.playingList;
      },
      currentIndex() {
        return this.$store.state.currentIndex;
      },
      currentSong() {
        return this.$store.getters.currentSong;
      },
      playing() {
        return this.$store.state.playing;
      },
      musicUrl() {
        return 'https://music.163.com/song/media/outer/url?id='+this.currentSong.id+'.mp3'
      },
      percent() {
        return this.currentTime/this.duration;
      }
    },
    created() {
      this.touch = {};
    },
    watch: {
      currentSong() {  //监听正在播放的歌曲改变
        // this.$nextTick(() => {
        //   this.$refs.audio.play();
        //   // console.log(this.$refs.audio.duration); 此时duration为NaN
          
        // })
        setTimeout(() => {
          this.$refs.audio.play();
        },1000) //防止手机前后台切换造成无法播放
        if(this.currentLyric) {
            console.log('stop')
            this.currentLyric.stop();
          }
        this.getLyric();
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio;
          newPlaying ? audio.play() : audio.pause();
        })
      }
    },
    components: {
      progressBar,
      Scroll
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
        // align-items: center;
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 190px;
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
                position: absolute;
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
          // position: absolute;
          // top: 0;
          vertical-align: top;
          width: 100vw;
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
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }

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
              .icon-icon--1 {
                font-size: 38px;
              }
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

      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>