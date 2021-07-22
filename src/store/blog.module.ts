import BlogService from '@/services/blog.service'
export const blog = {
  namespaced: true,
  state: {
    published: [],
    draws: [],
    post: {}
  },
  actions: {
    DRAWS (context:any) {
      return BlogService.getDraws().then(
        (response:any) => {
          context.commit('DRAWS_SUCCESS', response.data.data)
          return Promise.resolve(response.data.data)
        },
        (error:any) => {
          context.commit('DRAWS_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    PUBLISHED (context:any) {
      return BlogService.getArticles().then(
        (response:any) => {
          context.commit('ARTICLES_SUCCESS', response.data.data)
          return Promise.resolve(response.data.data)
        },
        (error:any) => {
          context.commit('ARTICLES_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    FIND (context:any, postID:any) {
      return BlogService.findArticle(postID).then(
        (response:any) => {
          context.commit('POST_SUCCESS', response.data.data)
          return Promise.resolve(response.data.data)
        },
        (error:any) => {
          context.commit('POST_FAILURE', null)
          return Promise.reject(error)
        }
      )
    },
    LIKE_POST (context:any, payload:any) {
      return BlogService.updateLikes(payload.postID, payload.userID).then(
        (response:any) => {
          context.dispatch('PUBLISHED')
          return Promise.resolve(response)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    },
    ADD_COMMENT (context:any, payload:any) {
      return BlogService.addComment(payload.postID, payload.data).then(
        (response:any) => {
          context.dispatch('PUBLISHED')
          return Promise.resolve(response)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    },
    REMOVE_COMMENT (context:any, payload:any) {
      return BlogService.removeComment(payload.postID, payload.data).then(
        (response:any) => {
          context.dispatch('PUBLISHED')
          return Promise.resolve(response)
        },
        (error:any) => {
          return Promise.reject(error)
        }
      )
    },
    CREATE (context:any, data:any) {
      return BlogService.create(data).then(
        (response:any) => {
          context.dispatch('PUBLISHED')
          context.dispatch('DRAWS')
          return Promise.resolve(response.data.data)
        },
        (error:any) => {
          console.log(error.response)
          return Promise.reject(error)
        }
      )
    },
    UPDATE (context:any, data: any) {
      return BlogService.update(data.postID, data.data).then(
        (response:any) => {
          context.dispatch('PUBLISHED')
          context.dispatch('DRAWS')
          return Promise.resolve(response.data.data)
        },
        (error:any) => {
          console.log(error.response)
          return Promise.reject(error)
        }
      )
    },
    DELETE (context:any, postID:any) {
      return BlogService.delete(postID).then(
        (response:any) => {
          context.dispatch('PUBLISHED')
          context.dispatch('DRAWS')
          return Promise.resolve(response.data)
        },
        (error:any) => {
          console.log(error.response)
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    DRAWS_SUCCESS (state:any, data: any) {
      state.draws = data
    },
    DRAWS_FAILURE (state:any, data: any) {
      state.draws = data
    },
    ARTICLES_SUCCESS (state:any, data: any) {
      state.published = data
    },
    ARTICLES_FAILURE (state:any, data: any) {
      state.published = data
    },
    POST_SUCCESS (state:any, data:any) {
      state.post = data
    },
    POST_FAILURE (state:any, data:any) {
      state.post = data
    }
  }
}
