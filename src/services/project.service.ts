import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'https://api.nihilo.fr/api/'

class ProjectService {
  getAllProjects () {
    return axios.get(API_URL + 'project/all', authHeader())
  }

  getProject (pid: any) {
    return axios.get(API_URL + 'project/' + pid, authHeader())
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
