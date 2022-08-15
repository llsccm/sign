import axios from 'axios'

// import store from '@/store'

let requests = axios.create({
  baseURL: '/api',
  timeout: 12000,
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
    console.log('err', err)
  }
)

export const login = ({ account, password }) => requests({
  url: '/old/v2/wx/forum/login',
  method: 'POST',
  data: {
    account,
    password,
  },
})


export const getInfo = token => requests({
  url: '/wx/account/info',
  method: 'GET',
  headers: { Authenticate: token },
})
export const sign = token => requests({
  url: '/wx/forum/clock?type=1',
  method: 'GET',
  headers: { Authenticate: token },
})
export const getSignDay = token => requests({
  url: '/wx/forum/clock/days?type=1',
  headers: { Authenticate: token },
  method: 'GET',
})
export const like = token => requests({
  url: `/wx/thread/like?tid=1124997`,
  method: 'GET',
  headers: { Authenticate: token },
})
export const dislike = token => requests({
  url: `/wx/thread/dislike?tid=1124997`,
  method: 'GET',
  headers: { Authenticate: token },
})
export const getVerify = token => requests({
  url: '/wx/thread/token',
  method: 'POST',
  headers: { Authenticate: token },
})
export const create = ({ token, verify, message }) => requests({
  url: '/wx/post/create',
  method: 'POST',
  headers: { Authenticate: token },
  data: { 
    "fid": 93, 
    "tid": "1110588", 
    "message": message, 
    "img_urls": [], 
    "reply_to": 108826, 
    "emojy": 0, 
    "verify": verify,
  },
})
export const postlike = ({ token, pid, tid }) => requests({
  url: `/wx/post/like?id=${pid}&type=0&tid=${tid}`,
  method: 'GET',
  headers: { Authenticate: token },
})
export const postdislike = ({ token, pid, tid }) => requests({
  url: `/wx/post/dislike?id=${pid}&type=0&tid=${tid}`,
  method: 'GET',
  headers: { Authenticate: token },
})
export const browse = token => requests({
  url: '/wx/first/post?tid=1124997',
  method: 'GET',
  headers: { Authenticate: token },
})
//旧版api
export const oldlogin = ({ account, password }) => requests({
  url: '/old/wx/forum/login',
  method: 'POST',
  data: {
    account,
    password,
  },
})
export const oldsgin = token=> requests({
  url: '/old/wx/forum/clock',
  method: 'GET',
  headers: { Authenticate: token },
})