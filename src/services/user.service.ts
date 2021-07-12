import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'https://api.nihilo.fr/api/'

class UserService {
  getUserProfil () {
    return axios.get(API_URL + 'me', authHeader())
  }

  UpdateUserProfil (data:any) {
    console.log(data)
    return axios.patch(API_URL + 'update/' + data.UID, data.user, authHeader())
  }

  DeleteUserProfil (uid:any) {
    console.log(uid)
    return axios.delete(API_URL + 'delete/' + uid, authHeader())
  }

  getProjects () {
    return axios.get(API_URL + '/project/all', authHeader())
  }
}

export default new UserService()
