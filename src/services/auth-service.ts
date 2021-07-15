import axios from 'axios'

const DEV_MODE = process.env.NODE_ENV !== 'production'
let API_URL = ''

if (DEV_MODE) {
  API_URL = 'http://localhost:4000/v1/'
} else {
  API_URL = 'https://api.nihilo.fr/v1/'
}

class AuthService {
  login (user:any) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password,
        keep: user.keepCo
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', response.data.token)
        }

        return response.data
      })
  }

  logout () {
    localStorage.removeItem('user')
  }

  register (user:any) {
    return axios.post(API_URL + 'register', {
      name: user.name,
      email: user.email,
      password: user.password
    })
  }
}

export default new AuthService()
