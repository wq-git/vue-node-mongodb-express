//import { login, logout, getInfo } from '../../api/user'
import { getToken, setToken, removeToken } from '../../utils/auth'
// import router, { resetRouter } from '@/router'
//
const state = {
  token:getToken(),
  name: '',
  // avatar: '',
  // introduction: '',
  roles: localStorage.getItem("roles")
}
//
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)

  },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },

  resetToken:(state)=>{
    state.token=''
    state.roles=[]
    removeToken()
  }
}
//
//const actions = {
//   // user login
//   login({ commit }, userInfo) {
//    console.log("userinfo",userInfo)
//     const { username, password } = userInfo
//     console.log("action",userInfo)
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         //console.log("res",data,data.token)
//         commit('SET_TOKEN', data.token)
//         console.log("store", state.token)
//         setToken(data.token)//在请求体的cookie加上一条，例如Admin-Token=U2FsdGVkX19MXsmckYYYuIOcXcu9kjg0TxvKgPmNhes=
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response
//
//         if (!data) {
//           reject('Verification failed, please Login again.')
//         }
//
//         const { roles, name, avatar, introduction } = data
//
//         // roles must be a non-empty array
//         if (!roles || roles.length <= 0) {
//           reject('getInfo: roles must be a non-null array!')
//         }
//
//         commit('SET_ROLES', roles)
//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         commit('SET_INTRODUCTION', introduction)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         commit('SET_TOKEN', '')
//         commit('SET_ROLES', [])
//         removeToken()
//         resetRouter()
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
  // remove token
//   resetToken({commit}) {
//     return new Promise(resolve => {
//       commit('SET_TOKEN', '')
//       commit('SET_ROLES', [])
//       removeToken()
//       resolve()
//     })
//   }
// }
//
//   // dynamically modify permissions
//   changeRoles({ commit, dispatch }, role) {
//     return new Promise(async resolve => {
//       const token = role + '-token'
//
//       commit('SET_TOKEN', token)
//       setToken(token)
//
//       const { roles } = await dispatch('getInfo')
//
//       resetRouter()
//
//       // generate accessible routes map based on roles
//       const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
//
//       // dynamically add accessible routes
//       router.addRoutes(accessRoutes)
//
//       // reset visited views and cached views
//       dispatch('tagsView/delAllViews', null, { root: true })
//
//       resolve()
//     })
//   }
//}
//
export default {
  namespaced: true,
  state,
  mutations,
  //actions
}
