import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useUsersStore } from './UsersStore'
import { SessionStorage } from 'quasar'

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
  useUsersStore(pinia).loadUsers()

  try {
    let userData = SessionStorage.getItem('userData')
    if(userData != []) {
      useUsersStore(pinia).login(userData.email, userData.password)
      useUsersStore(pinia).currentUser = userData
    }
    //console.log(userData)
  } catch (e) {
    console.log('No session founded')
  }

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})
