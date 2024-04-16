import { useUsersStore } from '../stores/UsersStore'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const usersStore = useUsersStore()
      if (usersStore.currentUser !== null) {
        next()
      } else {
        next('/connexion')
      }
    },
    children: [
      { path: '', redirect: 'accueil' },
      { path: 'accueil', component: () => import('pages/DashboardPage.vue') },
      { path: 'employees', component: () => import('pages/ManagedEmployeesPage.vue') },
      { path: 'planifier-entretien', component: () => import('pages/PlanifierEntretien.vue') },
      { path: 'entretiens', component: () => import('pages/EntretiensPage.vue') },
      { path: 'liste-entretiens', component: () => import('pages/ListeEntretiens.vue') },
      { path: 'mes-entretiens', component: () => import('pages/MesEntretiens.vue') },
      { path: 'mon-profil', component: () => import('pages/ProfilPage.vue') },
    ]
  },
  {
    path: '/connexion',
    component: () => import('layouts/ConnexionLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ConnexionPage.vue'),
        beforeEnter: (to, from, next) => {
          const usersStore = useUsersStore()
          if (usersStore.currentUser === null) {
            next()
          } else {
            next('/accueil')
          }
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
