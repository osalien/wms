import { selectOne,queryById } from '@/api/goodsBrowse'

const state = {

}

const mutations = {

}

const actions = {
  // user login
  selectOne({ commit }, params) {
    return new Promise((resolve, reject) => {
      selectOne(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },
  queryById({ commit }, params) {
    return new Promise((resolve, reject) => {
      queryById(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
