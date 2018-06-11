import { mapGetters } from 'vuex'

// 混合
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(val) {
      this.handlePlayList(val)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}