import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '@/views/Sign'
import Vote from '@/views/Vote'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Sign',
    component: Sign
  },
  {
    path: '/vote',
    name: 'Vote',
    component: Vote
  }
]

const router = new VueRouter({
  routes
})

export default router
