import request from '@/api/request'
// import store from '@/store'
import likeApi from './like'
import oldApi from './oldApi'

export const { like, dislike, postlike, postdislike } = likeApi
export const { oldlogin, oldsgin, oldgetSignDay, wxclock } = oldApi

export const login = ({ account, password }) =>
  request({
    url: '/wx/forum/login',
    method: 'POST',
    data: {
      account,
      password
    }
  })

export const getInfo = (token) =>
  request({
    url: '/wx/account/info',
    method: 'GET',
    headers: { Authenticate: token }
  })

export const sign = (token) =>
  request({
    url: '/wx/forum/clock?type=1',
    method: 'GET',
    headers: { Authenticate: token }
  })

export const getSignDay = (token) =>
  request({
    url: '/wx/forum/clock/days?type=1',
    headers: { Authenticate: token },
    method: 'GET'
  })

export const getVerify = (token) =>
  request({
    url: '/wx/thread/token',
    method: 'POST',
    headers: { Authenticate: token }
  })

export const create = ({ token, verify, message }) =>
  request({
    url: '/wx/post/create',
    method: 'POST',
    headers: { Authenticate: token },
    data: {
      fid: 93,
      tid: '1110588',
      message: message,
      img_urls: [],
      reply_to: 108826,
      emojy: 0,
      verify: verify
    }
  })

//浏览帖子
export const browse = ({ token, tid }) =>
  request({
    url: `/wx/first/post?tid=${tid}`,
    method: 'GET',
    headers: { Authenticate: token }
  })

export const getthreadlist = () =>
  request({
    url: '/v2/thread/recommend?fid=87&page=1&sort=2',
    method: 'GET'
  })

//投票
export const pollVote = (token) =>
  request({
    url: '/wx/poll/vote',
    method: 'POST',
    headers: { Authenticate: token },
    data: {
      tid: '1219361',
      option_ids: [19482, 19483]
    }
  })
