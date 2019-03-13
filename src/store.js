import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

export default new Vuex.Store({
  state: {
    playing: false,
    fullScreen: false,
    playingList: [],  //添加到播放列表的歌曲列表
    sequenceList: [], //歌曲顺序列表
    mode: playMode.sequence,
    currentIndex: -1, //当前播放歌曲索引
  },
  mutations: {
    SET_PLAYING_STATE(state, flag) {
      state.playing = flag;
    },
    SET_FULL_SCREEN(state, flag) {
      state.fullScreen = flag;
    },
    SET_PLAYLIST(state, list) {
      state.playingList = list;
    },
    SET_SEQUENCELIST(state,list) {
      state.sequenceList = list
    },
    SET_PALY_MODE(state,mode) {
      state.mode = mode;
    },
    SET_CURRENT_INDEX(state,index) {
      state.currentIndex = index;
    }
  },
  getters: {
    currentSong: state => {
      return state.playingList[state.currentIndex] || {}
    }
  },
  actions: {
    selectPlay({state,commit},{index,list}) {
      commit('SET_SEQUENCELIST',list);
      commit('SET_PLAYLIST',list);
      commit('SET_CURRENT_INDEX',index);
      commit('SET_FULL_SCREEN',true);
      commit('SET_PLAYING_STATE',true)
    }
  }
})
