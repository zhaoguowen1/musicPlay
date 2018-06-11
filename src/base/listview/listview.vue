<template>
  <scroll class="listview" 
          :data="data" 
          ref="listview" 
          :listenScroll="listenScroll" 
          :probeType="probeType" 
          @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.name">
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" :class="{current: currentIndex === index}" v-for="(item, index) in shortcutList" :key="index" :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getData } from 'common/js/dom'

  const ANCHOR_HEIGHT = 18 // 右侧导航每个li的高度
  const TITLE_HEIGHT = 30 // 固定样式的高度
  
  export default {
    created() {
      this.touch = {}
      this.listenScroll = true // 是否监听scroll-better的scroll 传入scroll组件的值
      this.listHeight = [] // 高度数组集合
      this.probeType = 3 // 传入scroll组件的值
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      // 生成右侧快速导航
      shortcutList() {
        return this.data.map((val) => {
          return val.title.substring(0, 1)
        })
      },
      fixedTitle() {
        // 获取顶部固定部分的显示内容
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      // 重置scroll
      refresh() {
        this.$refs.listview.refresh()
      },
      // 点击列表项
      selectItem(item) {
        this.$emit('select', item)
      },
      // 鼠标点击
      onShortcutTouchStart(e) {
        var anchorIndex = getData(e.target, 'index')
        this.touch.y1 = e.touches[0].pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      // 鼠标按住滑动
      onShortcutTouchMove(e) {
        this.touch.y2 = e.touches[0].pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      // 通过派发事件scroll来获取页面滚动的位置并复制给scrollY
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        // 当点击两侧空白处是return
        if (!index && index !== 0) {
          return
        }
        // 限制onShortcutTouchMove时index范围
        if (index < 0) {
          index = 0
          return
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 当点击快速导航时相应位置高亮
        this.scrollY = -(this.listHeight[index])
        // 当点击快速导航是左侧移动到相应位置
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 构建listHeight数组（相应段的clientHeight高度）
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      // 检测data当页面渲染完毕时调用_calculateHeight()
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 实时监听scrollY来改变快速导航高亮
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部 newY大于0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间滚动
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // 定义diff来实现固定
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = this.listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>