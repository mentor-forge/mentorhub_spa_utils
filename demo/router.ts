import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'PublicEntry',
      component: () => import('./pages/PublicAuthHint.vue'),
      meta: { requiresAuth: false },
      beforeEnter: (_to, _from, next) => {
        const { isAuthenticated } = useAuth()
        if (isAuthenticated.value) {
          next({ name: 'Demo', replace: true })
        } else {
          next()
        }
      },
    },
    {
      path: '/demo',
      name: 'Demo',
      component: () => import('./pages/DemoPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('./pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/demo',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    let redirectPath = '/demo'
    if (to.name === 'Demo') {
      redirectPath = '/demo'
    } else if (to.name === 'Admin') {
      redirectPath = '/admin'
    }

    next({
      path: '/',
      query: { redirect: redirectPath },
      replace: true,
    })
    return
  }

  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole) {
    const storedRoles = localStorage.getItem('user_roles')
    const roles = storedRoles ? JSON.parse(storedRoles) : []
    if (!roles.includes(requiredRole)) {
      next({ name: 'Demo' })
      return
    }
  }

  next()
})

export default router
