import { createStore } from 'vuex'
import { auth } from './auth.module'
import { user } from './user.module'
import { project } from './project.module'

export default createStore({
  state: {
    themeColor: null,
    primaryColor: '#3E7CB1FF'
  },
  mutations: {
    setTheme (state, theme) {
      state.themeColor = theme
      localStorage.theme = theme
    },
    changeOptions (state, colour) {
      state.primaryColor = colour
      console.log(colour)
    }
  },
  actions: {
    CHANGE_THEME (context, payload) {
      context.commit('setTheme', payload)
    },
    SAVE_OPTIONS (context, payload) {
      context.commit('changeOptions', payload)
    }
  },
  modules: {
    auth,
    user,
    project
  }
})
