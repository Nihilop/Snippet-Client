import axios from 'axios'
import authHeader from './auth-header'

const DEV_MODE = process.env.NODE_ENV !== 'production'
let API_URL = ''
let SHARE_URL = ''

if (DEV_MODE) {
  API_URL = 'http://localhost:4000/api/'
  SHARE_URL = 'http://localhost:8080/'
} else {
  API_URL = 'https://api.nihilo.fr/api/'
  SHARE_URL = 'https://api.nihilo.fr/'
}

class ProjectService {
  getAllProjects () {
    return axios.get(API_URL + 'project/all', authHeader())
  }

  getProject (pid: any) {
    return axios.get(API_URL + 'project/' + pid, authHeader())
  }

  getProjectPublic (pid: any) {
    return axios.get(SHARE_URL + 'share/' + pid)
  }

  createProject (data:any) {
    return axios.post(API_URL + 'project/create', data, authHeader())
  }

  UpdateProject (data:any, PID:any) {
    return axios.patch(API_URL + 'project/update/' + PID, data, authHeader())
  }

  deleteProject (pid:any) {
    return axios.delete(API_URL + 'project/delete/' + pid, authHeader())
  }

  getProjectsByCat (cid:any) {
    return axios.get(API_URL + 'project/category/' + cid, authHeader())
  }
}

export default new ProjectService()
