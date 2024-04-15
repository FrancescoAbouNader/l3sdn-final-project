// router/index.js

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: 'accueil' },
      { path: '/connexion', component: () => import('pages/ConnexionPage.vue') },
      { path: '/accueil', component: () => import('pages/DashboardPage.vue') },
      { path: '/managed-employees', component: () => import('pages/ManagedEmployeesPage.vue') },
      {path: '/user', component: () => import('pages/ConnexionUser.vue')},
      {path : '/admin', component: () => import('pages/ConnexionAdmin.vue')},

      { path: 'planifier-entretien', component: () => import('pages/PlanifierEntretien.vue') },
      { path: 'liste-entretiens', component: () => import('pages/ListeEntretiens.vue') },
      { path: 'mes-entretiens', component: () => import('pages/MesEntretiens.vue') }

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
