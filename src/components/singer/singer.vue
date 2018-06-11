<template>
	<div class="singer" ref="singer">
		<list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
	</div>
</template>

<script>
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import { mapMutations } from 'vuex'
  import { playListMixin } from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playListMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      // mixin中的函数用于数据更改时重新设置dom的位置 如何没有定义这个函数 将会报mixin.js中的错误
      handlePlayList(playList) {
        let bottom = playList.length > 0 ? '60px' : 0
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 获取歌手列表点击后的id
      selectSinger(val) {
        this.$router.push({
          path: `/singer/${val.id}`
        })
        // 调用vuex中mutations的SET_SINGER方法 修改state
        this.setSinger(val)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            // new Singer类 处理相同的内容
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 得到有序序列处理map
        let hot = [] // 热门
        let ret = [] // 其他
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      // 使用vuex调用mutations方法
      ...mapMutations({
        // 映射SET_SINGER
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>