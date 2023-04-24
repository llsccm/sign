import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '@/views/Sign'
import Vote from '@/views/Vote'
import Topup from '@/views/Topup'

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
  },
  {
    path: '/topup',
    name: 'Topup',
    component: Topup
  }
]

const router = new VueRouter({
  routes
})

export default router