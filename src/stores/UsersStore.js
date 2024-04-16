import { defineStore } from 'pinia'
import usersData from '../data/users.json'

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    users: [],
    currentUser: null
  }),
  actions: {
    loadUsers() {
      this.users = usersData
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
        return user
      } else {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect')
      }
    },
    logout() {
      this.currentUser = null
    },
    async updateUser(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
      } else {
        throw new Error('Utilisateur non trouvé')
      }
    },
    async updateProfil(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
        this.currentUser = updatedUser
      } else {
        throw new Error('Utilisateur non trouvé')
      }
    },
    async deleteUser(userId) {
      try {
        this.users = this.users.filter(user => user.id !== userId)
      } catch (error) {
        throw new Error('Une erreur est survenue lors de la suppression de l\'utilisateur')
      }
    }
  }
})
