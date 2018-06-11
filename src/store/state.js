// 状态
import { playMode } from 'common/js/config'

const state = {
  singer: {}, // 获取歌手页面点击时候的id avatar name
  playing: false, // 播放器是否播放
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表
  sequenceList: '', // 当点击播放模式（单曲等）时的播放列表
  mode: playMode.sequence, // 播放模式（单曲等）
  currentIndex: -1 // 当前playList的index
}
export default state