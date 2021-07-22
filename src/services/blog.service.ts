import axios from 'axios'
import authHeader from './auth-header'

const DEV_MODE = process.env.NODE_ENV !== 'production'
let API_URL = ''

if (DEV_MODE) {
  API_URL = 'http://localhost:4000/api/'
} else {
  API_URL = 'https://api.nihilo.fr/api/'
}

class BlogService {
  getDraws () {
    return axios.get(API_URL + 'blog/draws', authHeader())
  }

  getArticles () {
    return axios.get(API_URL + 'blog/publish', authHeader())
  }

  updateLikes (postID: any, userID: any) {
    return axios.patch(API_URL + 'blog/like/' + postID, userID, authHeader())
  }

  addComment (postID:any, data:any) {
    return axios.patch(API_URL + 'blog/comments/add/' + postID, data, authHeader())
  }

  removeComment (postID:any, data:any) {
    return axios.patch(API_URL + 'blog/comments/remove/' + postID, data, authHeader())
  }

  findArticle (postID: any) {
    return axios.get(API_URL + 'blog/find/' + postID, authHeader())
  }

  create (data:any) {
    return axios.post(API_URL + 'blog/create', data, authHeader())
  }

  update (postID:any, data:any) {
    return axios.patch(API_URL + 'blog/update/' + postID, data, authHeader())
  }

  delete (pid:any) {
    return axios.delete(API_URL + 'blog/delete/' + pid, authHeader())
  }
}

export default new BlogService()
