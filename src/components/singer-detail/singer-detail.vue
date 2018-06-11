<template>
  <transition :name="name">
    <music-list @slideName="slideName" :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer' // singer为store/getters.js 中的singer
      ])
    },
    data() {
      return {
        songs: [],
        name: 'slide'
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      // 设置动画效果
      slideName(val) {
        this.name = 'slideRight'
      },
      // 获取详情数据
      _getDetail() {
        // 如果在详情页刷新页面这是this.singer为空（跳转回歌手页面）
        if (!this.singer.id) {
          this.$router.push({
            path: '/singer/'
          })
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      // 数据处理
      _normalizeSongs(list) {
        let arr = []
        list.forEach((item) => {
          let { musicData } = item
          if (musicData.songid && musicData.albummid) {
            arr.push(createSong(musicData)) // createSong() 方法来自 common/js/song 调用song类返回对象
          }
        })
        return arr
      }
    },
    components: {
      MusicList
    }
  }
</script>  

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slider-leave-to
    transform: translate3d(100%, 0, 0)

  .slideRight-enter-active,.slideRight-leave-active
    transition: all 0.3s
  .slideRight-enter,.slideRight-leave-to
    transform: translate3d(100%, 0, 0)
  
</style>