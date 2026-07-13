import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '../src/composables/useAuth'
import { redirectToIdpLogin } from '../src/utils/idpRedirect'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/demo',
    },
    {
      path: '/demo',
      name: 'Demo',
      component: () => import('./pages/DemoPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/demo/editors',
      name: 'DemoEditors',
      component: () => import('./pages/EditorsPage.vue'),
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
    redirectToIdpLogin(window.location.origin + to.fullPath)
    next(false)
    return
  }

  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    next({ name: 'Demo' })
    return
  }

  next()
})

export default router
