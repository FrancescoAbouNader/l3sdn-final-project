import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { SessionStorage } from 'quasar'

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    users: [],
    currentUser: null
  }),
  actions: {
    loadUsers() {
      const response = api.get('/users')
      response.then((result) => {
        this.users = result.data
      })
    },
    getUsers() {
      return this.users
    },
    getUserById(id) {
      return this.users.find((user) => user.id === id)
    },
    async login(email, password) {
      const user = this.users.find(user => user.email === email && user.password === password)
      if (user) {
        this.currentUser = user
        SessionStorage.set('userData', user)
        return user
      } else {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect')
      }
    },
    logout() {
      this.currentUser = null
      SessionStorage.set('userData', [])
    },
    async updateUser(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
        api.put('/users', this.users)
      } else {
        throw new Error('Utilisateur non trouvé')
      }
    },
    async updateProfil(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
        this.currentUser = updatedUser
        api.put('/users', this.users)
      } else {
        throw new Error('Utilisateur non trouvé')
      }
    },
    async deleteUser(userId) {
      try {
        this.users = this.users.filter(user => user.id !== userId)
        api.put('/users', this.users)
      } catch (error) {
        throw new Error('Une erreur est survenue lors de la suppression de l\'utilisateur')
      }
    }
  }
})
