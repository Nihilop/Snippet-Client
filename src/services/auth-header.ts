export default function authHeader () {
  const user = localStorage.getItem('user')

  if (user) {
    const headers = { headers: { Authorization: 'Bearer ' + user } }
    return headers
  } else {
    return {}
  }
}
