import { getLists,add,update,selectOne } from '@/api/outWarehouseManagement'

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
  update({ commit }, params) {
    return new Promise((resolve, reject) => {
      update(params).then(result => {
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
  selectOne({ commit }, params) {
    return new Promise((resolve, reject) => {
      selectOne(params).then(result => {
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
