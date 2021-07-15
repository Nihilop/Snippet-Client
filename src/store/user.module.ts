import UserService from '@/services/user.service'
import AdminService from '@/services/admin.service'
export const user = {
  namespaced: true,
  state: {
    currentUser: {}
  },
  actions: {
    currentUser (context:any) {
      return UserService.getUserProfil().then(
        (response:any) => {
          if (localStorage.lang) {
            localStorage.lang = response.data.user.settings.lang
          } else {
            localStorage.lang = 'fr'
          }
          context.commit('currentUserSuccess', response.data.user)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          context.commit('currentUserFailure', null)
          return Promise.reject(error)
        }
      )
    },
    update ({ dispatch }:any, data:any) {
      return UserService.UpdateUserProfil(data).then(
        (response:any) => {
          dispatch('currentUser')
          return Promise.resolve(response.data)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    },
    delete (event:any, uid: any) {
      return UserService.DeleteUserProfil(uid).then(
        (response:any) => {
          return Promise.resolve(response.data)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    },
    // Admin
    getAllUsers (state:any) {
      return AdminService.getAllUsers().then(
        (response:any) => {
          return Promise.resolve(response.data)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    currentUserSuccess (state:any, data:any) {
      state.currentUser = data
    },
    currentUserFailure (state:any, data:any) {
      state.currentUser = data
    }
  }
}
