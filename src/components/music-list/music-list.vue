<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import { prefixStyle } from 'common/js/dom'
  import { mapActions } from 'vuex'
  import Loading from 'base/loading/loading'
  import { playListMixin } from 'common/js/mixin'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform') // 根据不同浏览器给transform添加前缀
  const backdrop = prefixStyle('backdrop-filter') // 根据不同浏览器给backdrop-filter（高斯模糊）添加前缀

  export default {
    mixins: [playListMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: -1
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      // mixin中的函数用于数据更改时重新设置dom的位置 如何没有定义这个函数 将会报mixin.js中的错误
      handlePlayList(playList) {
        let bottom = playList.length > 0 ? '60px' : 0
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 点击随机播放全部按钮
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      // 点击某一首歌曲
      selectItem(item, index) {
        // selectPlay方法调用
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      // 返回按钮
      back() {
        this.$router.back()
        this.$emit('slideName', true)
      },
      // 调用vuex中actions.js中的selectPlay方法执行多个mutation
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight // 图片固定高度
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT // layer向上滚动距离
      this.$refs.list.$el.style.top = `${this.imageHeight}px` // 设置scroll区域的top值
    },
    watch: {
      // 监听scroll滚动的y值来实现页面的滚动效果
      scrollY(newY) {
        let tranlateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        this.$refs.layer.style[transform] = `translate3d(0, ${tranlateY}px, 0)`
        // 当scroll往下滚动时放大缩小图片
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          // 设置图片的高斯模糊（ios）
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // 当layer滚动到RESERVED_HEIGHT高度时设置img的padding-top height z-index实现隐藏效果
        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          // 设置随机播放随滚动的隐藏和显示
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          // 设置随机播放随滚动的隐藏和显示
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        // 当scroll往下滚动时放大缩小图片
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>