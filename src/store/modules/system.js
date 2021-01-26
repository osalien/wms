import { getListDepartment,getListJob,getListMenu,getListRole,getListUser,addDepartment,addJob,addRole,addUser,deletedDepartment,updateDepartment,updateJob,updateRole,updateUser } from '@/api/system'

const state = {

}

const mutations = {

}

const actions = {
  // user login
  getListDepartment({ commit }, params) {
    return new Promise((resolve, reject) => {
      getListDepartment(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getListJob({ commit }, params) {
    return new Promise((resolve, reject) => {
      getListJob(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getListRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      getListRole(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getListUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      getListUser(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addDepartment({ commit }, params) {
    return new Promise((resolve, reject) => {
      addDepartment(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addJob({ commit }, params) {
    return new Promise((resolve, reject) => {
      addJob(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      addRole(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      addUser(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deletedDepartment({ commit }, params) {
    return new Promise((resolve, reject) => {
      deletedDepartment(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateDepartment({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateDepartment(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateUser(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateJob({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateJob(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateRole(params).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getListMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      getListMenu(params).then(result => {
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
