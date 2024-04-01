// router/index.js

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/connexion', component: () => import('pages/ConnexionPage.vue') },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/managed-employees', component: () => import('pages/ManagedEmployeesPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
