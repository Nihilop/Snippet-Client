import UserService from '@/services/user.service'
export const user = {
  namespaced: true,
  state: {
    currentUser: {}
  },
  actions: {
    currentUser (context:any) {
      return UserService.getUserProfil().then(
        (response:any) => {
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
          console.log(response.data)
          dispatch('currentUser')
          return Promise.resolve(response.data)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    },
    delete (event:any, uid: any) {
      console.log(event)
      return UserService.DeleteUserProfil(uid).then(
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
