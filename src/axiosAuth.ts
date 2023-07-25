import axios from 'axios'
import { clearTokens, getTokens, setTokens } from './utils/localStorageService'

/*
We want to use different APIs depending on where we are developing from. We can use the environment
variable NODE_ENV to change this between deployment and development, to query our different APIs.
 */
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8000'
} else {
  axios.defaults.baseURL = 'https://api.boardgametournaments.com'
}

/*
We always want to use credentials with our requests
 */
axios.defaults.withCredentials = true

/*
Following content from https://lightrains.com/blogs/axios-intercepetors-react/
 */

/*
This interceptor is responsible for applying any tokens which are set in local storage to the header
for any request made. This lets us apply those tokens without having to manually specify them in
every axios call.
 */
axios.interceptors.request.use(
  (config) => {
    const tokens = getTokens()
    if (tokens.access) {
      if (!config.headers) {
        // eslint-disable-next-line no-param-reassign
        config.headers = {}
      } else {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${tokens.access}`
      }
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

/*
Sometimes we will need to refresh our tokens. This is done by the following interceptor.
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    const tokens = getTokens()

    // If we already tried to refresh our tokens, then we want to redirect to login.
    if (
      error.response.status === 401
      && originalRequest.url === `${axios.defaults.baseURL}token/login/refresh/`
    ) {
      clearTokens()
      // TODO(keegan): not sure this works...
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // If this is a 401, we want to try to refresh the tokens.
    // eslint-disable-next-line no-underscore-dangle
    if (error.response.status === 401 && !originalRequest._retry && tokens.refresh) {
      // eslint-disable-next-line no-underscore-dangle
      originalRequest._retry = true
      return axios
        .post('token/login/refresh/', {
          refresh: tokens.refresh,
        })
        // eslint-disable-next-line consistent-return
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            // Got the right tokens, so let's perform the original request now
            setTokens(res.data)
            axios.defaults.headers.common.Authorization = `Bearer ${tokens.access}`
            return axios(originalRequest)
          }
        })
    }
    return Promise.reject(error)
  },
)

export default axios
