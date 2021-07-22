import AdminService from '@/services/admin.service'
export const admin = {
  namespaced: true,
  state: {
    users: [],
    projects: [],
    blog: []
  },
  actions: {
    // Admin
    getAllUsers (context:any) {
      return AdminService.getAllUsers().then(
        (response:any) => {
          context.commit('USERS_SUCCESS', response.data.users)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          context.commit('USERS_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    getAllProjects (context:any) {
      return AdminService.getProjects().then(
        (response:any) => {
          context.commit('PROJECTS_SUCCESS', response.data.data)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          context.commit('PROJECTS_FAILURE', null)
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    USERS_SUCCESS (state:any, data:any) {
      state.users = data
    },
    PROJECTS_SUCCESS (state:any, data:any) {
      state.projects = data
    },
    USERS_FAILURE (state:any, data:any) {
      state.users = data
    },
    PROJECTS_FAILURE (state:any, data:any) {
      state.users = data
    }
  }
}
