import axios from 'axios'
import authHeader from './auth-header'

const DEV_MODE = process.env.NODE_ENV !== 'production'
let API_URL = ''

if (DEV_MODE) {
  API_URL = 'http://localhost:4000/api/'
} else {
  API_URL = 'https://api.nihilo.fr/api/'
}

class UserService {
  getUserProfil () {
    return axios.get(API_URL + 'me', authHeader())
  }

  UpdateUserProfil (data:any) {
    return axios.patch(API_URL + 'update/' + data.UID, data.user, authHeader())
  }

  DeleteUserProfil (uid:any) {
    return axios.delete(API_URL + 'delete/' + uid, authHeader())
  }

  getProjects () {
    return axios.get(API_URL + '/project/all', authHeader())
  }
}

export default new UserService()
