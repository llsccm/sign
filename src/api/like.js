import requests from '@/api/request'
//点赞相关
const like = ({ token, tid }) => requests({
  url: `/wx/thread/like?tid=${tid}`,
  method: 'GET',
  headers: { Authenticate: token },
})

const dislike = token => requests({
  url: `/wx/thread/dislike?tid=1124997`,
  method: 'GET',
  headers: { Authenticate: token },
})

const postlike = ({ token, pid, tid }) => requests({
  url: `/wx/post/like?id=${pid}&type=0&tid=${tid}`,
  method: 'GET',
  headers: { Authenticate: token },
})

const postdislike = ({ token, pid, tid }) => requests({
  url: `/wx/post/dislike?id=${pid}&type=0&tid=${tid}`,
  method: 'GET',
  headers: { Authenticate: token },
})

export default { like, dislike, postlike, postdislike }