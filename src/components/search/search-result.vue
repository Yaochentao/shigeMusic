<template>
    <div class="search-result">
        <loading v-show='loading'></loading>
        <div class="songs" v-show='!loading'>
            <p class="title">单曲</p>
            <ul class="song-list">
                <li class="song" v-for="item in songs" :key="item.id" @click="addToPlay(item)">
                    <p class="name">{{item.name}}</p>
                    <p class="singer">{{item.artists[0].name}}</p>
                </li>
            </ul>
        </div>  
        <div class="play-lists" v-show='!loading'>
            <p class="title">歌单</p>
            <ul class="playLists-list">
                <li class="playList" v-for="item in playLists" :key="item.id" @click="toPlayList(item)">
                    <img :src="item.coverImgUrl" class="playList-img">
                    <div class="text">
                        <p class="name">{{item.name}}</p>
                        <p class="desc">{{item.description}}</p>
                    </div>
                </li>
            </ul>
        </div> 
        <div class="singers" v-show='!loading'>
            <p class="title">歌手</p>
            <ul class="singer-list">
                <li class="singer" v-for="item in artists" :key="item.id" @click="toSinger(item)">
                    <img :src="item.img1v1Url" class="singer-img">
                    <p class="name">{{item.name}}</p>
                </li>
            </ul>
        </div> 
    </div>
</template>
<script>
import {debounce} from '../../assets/debounce.js'
import { clearTimeout, setTimeout } from 'timers';
import loading from '../loading'
export default {
    props: {
        query: {
            type: String,
            default: '',
            selectSong: {}
        }
    },
    data() {
        return {
            songs: [],
            playLists: [],
            artists: []
        }
    },
    activated() {
        this.$store.commit('SHOW_LOADING');
    },
    created () {
        this.$watch('query', debounce((newQuery) => {
            console.log(newQuery);            //在watch属性中写就执行不了
            if(newQuery.length) {
                this.getSearchRes(newQuery);
            }
        }, 1000))
    }, 
    methods: {
        getSearchRes(newQuery)  {
            
            this.$http.get('http://116.62.124.130:3000/search/suggest?keywords='+newQuery)
            .then((res) => {
                console.log(res.data)
                this.artists = res.data.result.artists;
                this.songs = res.data.result.songs;
                this.playLists = res.data.result.playlists;
                this.$store.commit('HIDE_LOADING');
            })
        },
        addToPlay(item) {
            this.$http.get(`/song/detail?ids=${item.id}`)
            .then((res) => {
                console.log(res.data.songs[0]);
                this.selectSong = res.data.songs[0];
                console.log(this.playingList.length);
                let index = this.playingList.length;
                this.$store.dispatch('addToplayList' ,{
                    index : index,
                    song: this.selectSong
                })

            })
        },
        toPlayList(item) {
            this.$router.push({
                path: '/playList',
                query: {
                    id: item.id
                }
            })
        },
        toSinger(item) {
            this.$router.push({
                path: '/singer',
                query: {
                    id: item.id
                }
            })
        }
        // test(a = 1) {
        //     console.log(a)
        // },
        // abc : debounce(function() {
        //         this.test('1')
        //     },3000)   methods中防抖应这样使用
    },
    // watch: {
    //     query: debounce((newQuery) => {
    //             console.log(newQuery);
    //             // this.test(newQuery);
    //             console.log(this)
    //         }, 3000)
    //     },
    computed: {
        loading() {
            return this.$store.state.LOADING;
        },
        playingList() {
            return this.$store.state.playingList;
        },
    },
    components :{
        loading
    }
}

</script>
<style lang="less" scoped>
@import '../../assets/variable'; 
    .search-result {
        width: 100%;
        position: relative;
        margin-bottom: 40px;
        .songs {
            width: 100%;
            .title {
                border-bottom: 1px solid rgb(228, 228, 228);
                padding: 10px 10px 0 6px;
                color: @color-text;
                font-weight: bold;
            }
            .song-list {
                width: 100%;
                .song {
                    padding: 3px 20px;
                    height: 50px;
                    align-items: center;
                    border-bottom: 1px solid rgb(228, 228, 228);
                    .name {
                        font-size: @font-size-medium-x;
                        color: @color-text;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .singer {
                        font-size: 12px;
                        color: @color-text-g;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
        .play-lists {
            width: 100%;
            .title {
                border-bottom: 1px solid rgb(228, 228, 228);
                padding: 10px 10px 0 6px;
                color: @color-text;
                font-weight: bold;
            }
            .playLists-list {
                width: 100%;
                .playList {
                    padding: 1vw;
                    align-items: center;
                    border-bottom: 1px solid rgb(228, 228, 228);
                    .playList-img {
                        display: inline-block;
                        vertical-align: middle;
                        width: 24vw;
                        height: 24vw;
                        border-radius: 3px;
                    }
                    .text {
                        vertical-align: middle;
                        width: 72vw;
                        display: inline-block;
                        margin: 0 1vw;
                        .name {
                            font-size: @font-size-medium-x;
                            color: @color-text;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        .desc {
                            font-size: 12px;
                            color: @color-text-g;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }
        .singers {
            width: 100%;
            .title {
                border-bottom: 1px solid rgb(228, 228, 228);
                padding: 10px 10px 0 6px;
                color: @color-text;
                font-weight: bold;
            }
            .singer-list {
                width: 100%;
                .singer {
                    padding: 1vw;
                    align-items: center;
                    border-bottom: 1px solid rgb(228, 228, 228);
                    .singer-img {
                        display: inline-block;
                        vertical-align: middle;
                        width: 24vw;
                        height: 24vw;
                        border-radius: 3px;
                        border-radius: 12vw;
                    }
                    .name {
                        margin-left: 3vw;
                        display: inline-block;
                        vertical-align: middle;
                        font-size: @font-size-medium-x;
                        color: @color-text;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
 
               }
            }
        }
    }
</style>

