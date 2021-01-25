import { getLists,queryById } from '@/api/inventoryHistory'

const state = {

}

const mutations = {

}

const actions = {
  // user login
  getList({ commit }, params) {
    return new Promise((resolve, reject) => {
      getLists(params).then(result => {
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
