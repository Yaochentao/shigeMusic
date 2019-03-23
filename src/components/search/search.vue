<template>
    <transition name='search'>
        <div class="search">
            <div class="search-box-wrapper">
                <i class="iconfont icon-sdf" @click="back"></i>
                <div class="search-box">
                    <input type="text" class="box" v-model="query">
                    <i v-show="query" class="iconfont icon-guanbi" @click="emptyQuery"></i>
                </div>
            </div>
            <scroll class="search-scroll-wrapper" ref="scroll">
                <div>
                    <div class="search-hots" v-show="!query">
                        <p class="title">热门搜索</p>
                        <span @click="setQuery(item.first)" class="search-hots-item" v-for="(item,index) in hots" :key="index">
                        {{item.first}}
                        </span>
                    </div>
                    <search-result v-show="query" :query="query"></search-result>
                </div>
            </scroll>
        </div>
    </transition>
</template>
<script>
import scroll from '../scroll'
import searchResult from './search-result'
    export default {
        data() {
            return {
                hots: [1,2],
                query: ''
            }
        },
        created() {
            this.getHots()
        },
        activated() {
            this.query = ''
        },
        methods: {
            back() {
                this.$router.back();
                this.query = '';
            },
            getHots() {
                this.$http.get('/search/hot')
                .then((res) => {
                    this.hots = res.data.result.hots
                })
            },
            setQuery(query) {
                this.query = query;
            },
            emptyQuery() {
                this.query = '';
            }
        },
        components: {
            scroll,
            searchResult
        }
        
    }
</script>

<style lang="less" scoped>
    @import '../../assets/variable';

    .search-enter-active,
    .search-leave-active {
        transition: all 0.3s;
    }

    .search-enter,
    .search-leave-to {
        transform: translate3d(50%, 0, 0);
        opacity: 0;
    }

    .search {
        position: fixed;
        z-index: 101;
        width: 100%;
        top: 0;
        bottom: 0;
        background: @color-background;
        .search-box-wrapper {
            position: relative;
            display: flex;
            padding: 10px 10px 5px 15px;
            background: @color-theme;
            .icon-sdf {
                margin: -5px 10px 0 0;
                font-size: 22px;
                color: #fff;
            }
            .search-box {
                display: flex;
                align-items: center;
                box-sizing: border-box;
                width: 100%;
                height: 25px;
                border-bottom: 1px solid rgb(235, 235, 235);
                .box {
                    flex: 1;
                    line-height: 25px;
                    background: @color-theme;
                    color: #fff;
                    font-size: @font-size-medium;
                    border: none;
                    outline: medium;
                    &::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                    }
                }
                .icon-guanbi {
                    margin-right: 8px;
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.8);
                    border: none;
                }
            }
        }
        .search-scroll-wrapper {
            height: 100%;
            overflow: hidden;
            .search-hots {
                padding: 20px 10px;
                .title {
                    color: @color-text;
                    font-weight: bold;
                    font-size: @font-size-medium;
                }
                .search-hots-item {
                    font-size: @font-size-medium;
                    display: inline-block;
                    padding: 3px 8px;
                    margin: 4px 4px;
                    background: #f0ebeb;
                    border-radius: 10px;
                    height: 20px;
                    line-height: 20px;
                    color: @color-text;
                }
            }
        }
    }
</style>