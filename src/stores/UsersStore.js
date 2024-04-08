import { defineStore } from 'pinia'
import usersData from '../data/users.json'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    loadUsers() {
      this.users = usersData
    },
    getUserById(id) {
      return this.users.find((user) => user.id === id)
    }
  }
})
