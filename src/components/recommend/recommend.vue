<template>
    <div class="recommend">
        <scroll class="recommend-content" ref="scroll" :data="recommendPlayLists">
            <div>
                <div v-show="banner.length" class="decorate" v-if="banner.length"></div>
                <div v-if="banner.length" class="slider-wrapper">
                    <slider>
                        <div class="slider-item" v-for="item in banner" :key="item.imageUrl">
                            <img :src="item.imageUrl">
                        </div>
                    </slider>
                </div>
                <!-- <div class="nav">
                    <div class="nav-item">
                        <i class="nav-icon iconfont icon-icon--"></i>
                        <span class="nav-text">私人FM</span>
                    </div>
                    <div class="nav-item">
                        <i class="nav-icon iconfont icon-calendar_icon"></i>
                        <span class="nav-text">每日推荐</span>
                    </div>
                    <div class="nav-item">
                        <i class="nav-icon iconfont icon-icon-"></i>
                        <span class="nav-text">歌单</span>
                    </div>
                    <div class="nav-item">
                        <i class="nav-icon iconfont icon-paixingbang"></i>
                        <span class="nav-text">排行榜</span>
                    </div>
                </div> -->
                <div class="recommend-list">
                    <h1 class="title">推荐歌单</h1>
                    <ul>
                        <li @click="toPlayList(item)" class="item" v-for="item in recommendPlayLists" :key="item.id">
                            <div class="icon">
                                <div class="gradients"></div>
                                <img v-lazy="item.picUrl">
                            </div>
                            <p class="play-count">
                                <i class="iconfont icon-erji"></i>
                                {{Math.floor(item.playCount / 10000) }}万
                            </p>
                            <div class="text">
                                <p class="name">{{item.name}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="recommend-song">
                    <h1 class="title">推荐歌曲</h1>
                    <ul>
                        <li class="item" v-for="item in recommendMusics" :key="item.id">
                            <div class="icon">
                                <img v-lazy="item.song.album.picUrl">
                            </div>
                            <p class="text">{{item.name}}</p>
                            <p class="singer">{{item.song.artists[0].name}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
    import slider from './slide';
    import scroll from '../scroll'
    export default {
        data() {
            return {
                banner: [],
                recommendPlayLists: [],
                recommendMusics: []
            }
        },
        mounted() {
            this.$http.get('/banner')
                .then((res) => {
                    this.banner = res.data.banners;
                })
            this.$http.get('/personalized')
                .then((res) => {
                    this.recommendPlayLists = res.data.result;
                })
            this.$http.get('/personalized/newsong')
                .then((res) => {
                    this.recommendMusics = res.data.result;
                })
        },
        activated() {
            this.$nextTick(() => {
                this.$refs.scroll.refresh();
            })
        },
        methods: {
            toPlayList(item) {
                this.$router.push({
                    path: '/playList',
                    query: {
                        id: item.id
                    }
                })
                
            }
        },
        components: {
            slider,
            scroll
        }
    }
</script>

<style lang="less" scoped>
    @import '../../assets/variable';

    .recommend {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        z-index: 100;

        .recommend-content {
            width: 100%;
            height: 100%;
            overflow: hidden;

            .decorate {
                position: absolute;
                top: 0vh;
                z-index: -10;
                background: @color-theme;
                width: 100%;
                height: 15vh;
                vertical-align: inherit;
            }

            .slider-wrapper {
                width: 96%;
                margin: 0 auto;
                border-radius: 5px;
                overflow: hidden;
            }

            .nav {
                width: 100%;
                height: 12vh;
                display: flex;

                .nav-item {
                    flex: 1;
                    height: 100%;

                    .nav-icon {
                        margin: 1vh 4vw;
                        width: 17vw;
                        height: 17vw;
                        display: inline-block;

                        border-radius: 50%;
                        background: @color-theme;
                        text-align: center;
                        vertical-align: middle;
                        color: @color-text-lm;
                        font-size: 9vw;
                    }

                    .nav-text {
                        display: inline-block;
                        width: 100%;
                        font-size: @font-size-small;
                        color: @color-text-g;
                        text-align: center;
                    }

                }
            }

            .recommend-list {
                position: relative;
                box-sizing: border-box;
                width: 100%;
                text-align: center;

                .title {
                    height: 65px;
                    line-height: 65px;
                    padding-left: 1.5%;
                    text-align: left;
                    font-size: @font-size-medium;
                    font-weight: bold;
                    color: @color-text;
                }

                .item {
                    display: inline-block;
                    position: relative;
                    box-sizing: border-box;
                    width: 33%;
                    padding: 0 1%;

                    .icon {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 5px;

                        .gradients {
                            position: absolute;
                            top: 0;
                            width: 100%;
                            height: 35px;
                            border-radius: 3px;
                            background: linear-gradient(rgba(109, 109, 109, 0.4), rgba(255, 255, 255, 0));
                        }

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 3px;
                        }
                    }

                    .play-count {
                        position: absolute;
                        top: 5px;
                        right: 8px;
                        font-size: @font-size-small-s;
                        color: @color-text-l;
                        .icon-erji {
                            font-size: 12px;
                        }
                    }

                    .text {
                        float: left;
                        line-height: 16px;
                        text-align: left;
                        height: 40px;
                        line-height: 16px;
                        overflow: hidden;
                        margin-bottom: 10px;
                        font-size: @font-size-small;
                    }
                }
            }

            .recommend-song {
                margin-top: -20px;
                box-sizing: border-box;
                width: 100%;
                text-align: center;

                .title {
                    height: 65px;
                    line-height: 65px;
                    padding-left: 1.5%;
                    text-align: left;
                    font-size: @font-size-medium;
                    font-weight: bold;
                    color: @color-text;
                }

                .item {
                    display: inline-block;
                    position: relative;
                    box-sizing: border-box;
                    width: 33%;
                    padding: 0 1%;

                    .icon {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 5px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 3px;
                        }
                    }

                    .text {
                        line-height: 16px;
                        text-align: left;
                        height: 16px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        font-size: @font-size-small;
                    }

                    .singer {
                        line-height: 16px;
                        margin-bottom: 10px;
                        text-align: left;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        font-size: @font-size-small;
                        color: @color-text-g;
                    }
                }
            }
        }
    }
</style>