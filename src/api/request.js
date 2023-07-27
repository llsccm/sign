import axios from 'axios'

let request = axios.create({
  baseURL: '/api',
  timeout: 12000,
  withCredentials: true,
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (res) => {
    // console.log(res.data)
    return res.data
  },
  (err) => {
    console.log('err', err.response)
    return err.response
  }
)

export default request