import requests from '@/api/request'

//旧版api
export default {
  oldlogin: ({ account, password }) => requests({
    url: '/old/wx/forum/login',
    method: 'POST',
    data: {
      account,
      password,
    },
  }),
  oldsgin: token => requests({
    url: '/old/wx/forum/clock',
    method: 'GET',
    headers: { Authenticate: token },
  }),
  wxclock: () => requests({
    url: '/official/api/clock/do',
    method: 'POST',
    // headers: {cookie}
  }),
  oldgetSignDay: token => requests({
    url: '/old/wx/forum/clock/days',
    method: 'GET',
    headers: { Authenticate: token },
  })
}