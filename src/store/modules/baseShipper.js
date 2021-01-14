import { getLists,addckowner,addUserName,addUserPhone } from '@/api/baseShipper'

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
  addckowners({ commit }, params) {
    return new Promise((resolve, reject) => {
      addckowner(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addUserName({ commit }, params) {
    return new Promise((resolve, reject) => {
      addUserName(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
