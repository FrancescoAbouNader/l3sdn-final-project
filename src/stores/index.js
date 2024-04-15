import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useUsersStore } from './UsersStore'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // Chargement des données des utilisateurs au lancement de l'application
  //const usersStore = useUsersStore(pinia).loadUsers()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})
