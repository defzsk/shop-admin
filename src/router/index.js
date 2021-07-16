import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import welcome from '../views/welcome.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 路由重定向到login页面
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: home,
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: welcome
      },
      {
        path: '/users',
        name: 'user',
        component: () => import('@/views/Users/user.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过
  // next()

  const token = window.sessionStorage.getItem('token')

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (token) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

export default router
