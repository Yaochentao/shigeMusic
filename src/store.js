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
    LOADING: false,   //控制loading组件
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
      console.log('SET_SEQUENCELIST')
      state.sequenceList = list;
    },
    SET_PALY_MODE(state,mode) {
      state.mode = mode;
    },
    SET_CURRENT_INDEX(state,index) {
      state.currentIndex = index;
    },
    SHOW_LOADING(state) {
      state.LOADING = true;
    },
    HIDE_LOADING(state) {
      state.LOADING = false;
    },
    ADD_TO_PLAYLIST(state,song) {
      let _list = state.playingList;
      _list.push(song);
      state.playingList = _list;
    },
    ADD_TO_SEQUENCELIST(state,song) {
      // let _list = state.sequenceList;
      // _list.push(song);
      // state.sequenceList = _list;
      state.sequenceList = state.playingList;
    },
  },
  getters: {
    currentSong: state => {
      return state.playingList[state.currentIndex] || {}
    },
    getSequenceList: state => {
      return state.sequenceList;
    }
  },
  actions: {
    selectPlay({state,commit},{index,list}) {
      // console.log(state.mode);
      commit('SET_SEQUENCELIST',list);
      commit('SET_PLAYLIST',list);
      commit('SET_CURRENT_INDEX',index);
      commit('SET_FULL_SCREEN',true);
      commit('SET_PLAYING_STATE',true)
    },
    addToplayList({state,commit},{index,song}) {
      commit('ADD_TO_PLAYLIST',song);
      commit('ADD_TO_SEQUENCELIST',song);
      commit('SET_CURRENT_INDEX',index);
      commit('SET_FULL_SCREEN',true);
      commit('SET_PLAYING_STATE',true)
    },
    deleteSong ({commit, state}, song) {
      let playingList = state.playingList.slice()
      let sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      let pIndex = playingList.findIndex((item) => {
        return item.id === song.id
      })
      playingList.splice(pIndex, 1)
      let sIndex = sequenceList.findIndex((item) => {
        return item.id === song.id
      })
      sequenceList.splice(sIndex, 1)

      if (currentIndex > pIndex || currentIndex === playingList.length) {
        currentIndex--
      } // 删除的song在播放列表前或为播放列表最后一项时 currentIndex--

      commit('SET_PLAYLIST', playingList)
      commit('SET_SEQUENCELIST', sequenceList)
      commit('SET_CURRENT_INDEX', currentIndex)

      const playingState = playingList.length > 0
      // 歌曲删除完毕时停止播放
      commit('SET_PLAYING_STATE', playingState)
    },
    clearAllSongs ({commit,state}) {
      commit('SET_PLAYLIST', [])
      commit('SET_SEQUENCELIST', [])
      commit('SET_CURRENT_INDEX', -1)
      commit('SET_PLAYING_STATE', false)
    }
  }
})
