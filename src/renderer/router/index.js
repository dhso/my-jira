import Vue from 'vue'
import Router from 'vue-router'
import Stores from 'electron-store'
import { remote } from 'electron'

Vue.use(Router)

const stores = new Stores()

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/views/main-page').default,
      redirect: '/my-dashboard',
      children: [
        {
          path: 'my-dashboard',
          name: 'my-dashboard',
          component: require('@/views/main-page/my-dashboard').default,
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: 'my-issues',
          name: 'my-issues',
          component: require('@/views/main-page/my-issues').default,
          meta: {
            title: 'Issues'
          }
        },
        {
          path: 'my-settings',
          name: 'my-settings',
          component: require('@/views/main-page/my-settings').default,
          meta: {
            title: 'Settings'
          }
        }
      ],
      beforeEnter: (to, from, next) => {
        if (!stores.get('system.loginInfo')) {
          return next({ name: 'login-page' })
        }
        next()
      }
    },
    {
      path: '/login-page',
      name: 'login-page',
      component: require('@/views/login-page').default,
      meta: {
        title: 'Login'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    remote.getCurrentWindow().setTitle(`${remote.app.getName()} - ${to.meta.title}`)
  }
  next()
})

export default router
