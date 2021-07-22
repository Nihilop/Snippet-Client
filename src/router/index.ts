import { createRouter, createWebHistory } from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
const RouterLayout = createRouterLayout((layout) => import(`@/layouts/${layout}.vue`))

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior () {
    const el = document.querySelector('body')
    if (el) {
      document.body.scrollTop = 0
      el.scrollTop = 0
    }
  },
  routes: [
    {
      path: '/',
      component: RouterLayout,
      children: routes
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('require auth')
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const loggedIn = localStorage.getItem('user')
    if (!loggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
