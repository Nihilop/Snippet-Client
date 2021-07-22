import axios from 'axios'
import authHeader from './auth-header'

const DEV_MODE = process.env.NODE_ENV !== 'production'
let API_URL = ''

if (DEV_MODE) {
  API_URL = 'http://localhost:4000/api/'
} else {
  API_URL = 'https://api.nihilo.fr/api/'
}

class AdminService {
  getAllUsers () {
    return axios.get(API_URL + 'users', authHeader())
  }

  getProjects () {
    return axios.get(API_URL + 'projects', authHeader())
  }
}

export default new AdminService()
