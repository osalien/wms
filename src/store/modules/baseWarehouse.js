import { getLists, add, rolesSelect } from '@/api/baseWarehouse'

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

  add({ commit }, params) {
    return new Promise((resolve, reject) => {
      add(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  rolesSelect({ commit }, params) {
    return new Promise((resolve, reject) => {
      rolesSelect(params).then(result => {
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
