import ProjectService from '@/services/project.service'
export const project = {
  namespaced: true,
  state: {
    projects: [],
    categories: [],
    cateSelected: '',
    project: {},
    PIDIsSelected: false,
    CIDIsSelected: false
  },
  actions: {
    ALL_PROJECTS (context:any) {
      return ProjectService.getAllProjects().then(
        (response:any) => {
          context.commit('ALL_PROJECT_SUCCESS', response.data.data)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          context.commit('ALL_PROJECT_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    CREATE_PROJECT (context:any, data:any) {
      return ProjectService.createProject(data).then(
        (response:any) => {
          console.log(response.data)
          context.dispatch('ALL_PROJECTS')
          if (data.category === context.state.cateSelected) {
            context.dispatch('CATEGORY_SELECTED', context.state.cateSelected)
          }
          return Promise.resolve(response.data)
        },
        (error:any) => {
          console.log(error.response)
          return Promise.reject(error)
        }
      )
    },
    UPDATE_PROJECT (context:any, data: any) {
      return ProjectService.UpdateProject(data.data, data.pid).then(
        (response:any) => {
          context.dispatch('CATEGORY_SELECTED', context.state.cateSelected)
          context.dispatch('SELECT_PROJECT', data.pid)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          console.log(error.response)
          return Promise.reject(error)
        }
      )
    },
    DELETE_PROJECT (context:any, PID:any) {
      return ProjectService.deleteProject(PID).then(
        (response:any) => {
          context.dispatch('ALL_PROJECTS')
          context.dispatch('CATEGORY_SELECTED', context.state.cateSelected)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          console.log(error.response)
          return Promise.reject(error)
        }
      )
    },
    CATEGORY_SELECTED (context:any, category:any) {
      return ProjectService.getProjectsByCat(category).then(
        (response:any) => {
          context.commit('SELECT_CATEGORY_SUCCESS', response.data.data)
          context.commit('WHAT_IS_CAT', category)
          context.commit('TOGGLE_UI')
          return Promise.resolve(response.data)
        },
        (error:any) => {
          context.commit('SELECT_CATEGORY_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    SELECT_PROJECT (context:any, payload:any) {
      return ProjectService.getProject(payload).then(
        (response:any) => {
          context.commit('SELECT_PROJECT', response.data.data)
          return Promise.resolve(response.data)
        },
        (error:any) => {
          context.commit('SELECT_CATEGORY_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    RESET_ALL (context:any) {
      context.commit('RESET')
    }
  },
  mutations: {
    ALL_PROJECT_SUCCESS (state:any, data: any) {
      state.projects = data
    },
    ALL_PROJECT_FAILURE (state:any, data: any) {
      state.projects = data
    },
    SELECT_CATEGORY_SUCCESS (state:any, data:any) {
      state.categories = data
    },
    SELECT_CATEGORY_FAILURE (state:any, data:any) {
      state.categories = data
    },
    WHAT_IS_CAT (state:any, data:any) {
      state.cateSelected = data
    },
    SELECT_PROJECT (state:any, project:any) {
      state.project = project
      state.PIDIsSelected = true
    },
    TOGGLE_UI (state:any) {
      state.CIDIsSelected = false
      setTimeout(() => {
        state.CIDIsSelected = true
      }, 200)
    },
    RESET (state:any) {
      state.CIDIsSelected = false
      state.PIDIsSelected = false
      state.cateSelected = ''
      state.categories = []
    }
  }
}
