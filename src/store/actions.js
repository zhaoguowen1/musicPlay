// 异步操作或对mutations进行封装
import * as types from './mutations-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点击song-list时执行多个mutations
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index]) // 改变currentIndex的值
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 点击随机播放全部按钮时执行多个mutations
export const randomPlay = function ({commit, state}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}