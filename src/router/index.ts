import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'

const RouterLayout = createRouterLayout((layout) => import(`@/layouts/${layout}.vue`))

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
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
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  // Redirect if :
  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
