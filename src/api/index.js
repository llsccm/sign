import axios from 'axios'
// import store from '@/store'

let requests = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

requests.interceptors.request.use((config) => {
  // if(config.method === 'get') {
  //   config.headers.Authenticate = store.state.token
  // }
  return config
})

requests.interceptors.response.use(
  (res) => {
    // console.log(res.data)
    return res.data
  },
  (err) => {
    console.log('err',err)
  }
)

export const login = ({ account, password }) => requests({
    url: '/v2/wx/forum/login',
    method: 'POST',
    data: {
      account,
      password,
    },
  })


export const getInfo = token => requests({
    url: '/v2/wx/account/info',
    method: 'GET',
    headers: { Authenticate: token },
  })
export const sign = token => requests({
    url: '/v2/wx/forum/clock?type=1',
    method: 'GET',
    headers: { Authenticate: token },
  })
export const getSignDay = token => requests({
    url: '/v2/wx/forum/clock/days?type=1',
    headers: { Authenticate: token },
    method: 'GET',
  })