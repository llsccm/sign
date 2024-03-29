import axios from 'axios'

let request = axios.create({
  baseURL: '/api',
  timeout: 15000,
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
    console.log('err', err)
    return err.response
  }
)

export default request