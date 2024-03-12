<template>
    <q-page class="flex flex-center">
      <q-card class="login-card">
        <q-card-section>
          <q-form @submit.prevent="login">
            <q-input v-model="username" filled label="Nom d'utilisateur" dense/>
            <q-input v-model="password" filled label="Mot de passe" type="password" dense/>
            <q-btn type="submit" color="primary" label="Se connecter" class="full-width" :loading="loading"/>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { login } from 'components/auth.js'
    
  export default defineComponent({
    name: 'ConnexionPage',
    setup() {
      const username = ref('')
      const password = ref('')
      const loading = ref(false)
  
      const loginUser = async () => {
        try {
          loading.value = true
          const user = await login(username.value, password.value)
          if (user.role === 'admin') {
          } else {
          }
        } catch (error) {
          console.error('Erreur de connexion:', error.message)
        } finally {
          loading.value = false
        }
      }
  
      return { username, password, loading, login: loginUser }
    }
  })
  </script>
  
  <style scoped>
  .login-card {
    max-width: 400px;
    width: 100%;
  }
  
  .full-width {
    width: 100%;
  }
  </style>
  