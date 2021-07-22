import { createStore } from 'vuex'
import { auth } from './auth.module'
import { user } from './user.module'
import { project } from './project.module'
import { admin } from './admin.module'
import { blog } from './blog.module'

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
    admin,
    blog,
    project
  }
})
