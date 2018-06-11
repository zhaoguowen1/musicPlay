<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { prefixStyle } from 'common/js/dom'

  const progressBtnWidth = 16 // 按钮宽度
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      // 点击进度条
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect() // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      },
      progressTouchStart(e) {
        this.touch.initMove = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initMove) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd(e) {
        this.touch.initMove = false
        this._triggerPercent()
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px` // 设置偏移部分的宽度
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` // 设置小球偏移样式
      },
      // 将touch事件滑动后的比例派发出去使歌曲时间到达移动到的时间
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      // 监听当前播放时间
      percent(newTime) {
        if (newTime >= 0 && !this.touch.initMove) { // initMove===false表示没有在touch  解决滑动和默认之间的重复
          let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 获取进度条总长度
          let offsetWidth = newTime * barWidth // 获取偏移的距离
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>

