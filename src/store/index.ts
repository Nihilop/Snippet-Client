import { createStore } from 'vuex'
import { auth } from './auth.module'
import { user } from './user.module'
import { project } from './project.module'

export default createStore({
  state: {
    themeColor: null
  },
  mutations: {
    setTheme (state, theme) {
      state.themeColor = theme
      localStorage.theme = theme
    }
  },
  actions: {
    CHANGE_THEME (context, payload) {
      context.commit('setTheme', payload)
    }
  },
  modules: {
    auth,
    user,
    project
  }
})
