import axios from 'axios'

// TODO: make this dynamic for whatever website we end up getting
if (process.env.NODE_ENV) {
  axios.defaults.baseURL = 'http://localhost:8000'
} else {
  axios.defaults.baseURL = 'https://api.boardgametournaments.com'
}

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post.Accept = 'application/json'
export default axios
