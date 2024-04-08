<template>
  <div class="page">
    <q-page>
      <q-form @submit="submitForm">
        <q-input v-model="username" label="Nom d'utilisateur" />
        <q-input v-model="password" label="Mot de passe" type="password" />
        <q-btn type="submit" label="Se connecter" color="primary" />
      </q-form>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConnexionPage',
  data() {
    return {
      users: [
        {
          username: 'user',
          password: 'user',
          role: 'user',
          firstName: 'Alexis',
          lastName: 'Dumont',
          gender: 'male'
        },
        {
          username: 'admin',
          password: 'admin',
          role: 'admin',
          firstName: 'Jane',
          lastName: 'Ariette',
          gender: 'female'
        }
      ]
    }
  },
  methods: {
    submitForm() {
      // Vérifiez les informations de connexion par rapport aux utilisateurs prédéfinis
      const foundUser = this.users.find(user => user.username === this.username && user.password === this.password)

      if (foundUser) {
        // Redirection en fonction du rôle
        if (foundUser.role === 'admin') {
          this.$router.push('/admin')// Redirection vers la page admin
        } else {
          this.$router.push('/user') // Redirection vers la page utilisateur normale
        }
      } else {
        // Affichez un message d'erreur à l'utilisateur
        this.$q.notify({ message: 'Identifiants incorrects', color: 'negative' })
      }
    }
  }

})
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.q-form {
  max-width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.q-input {
  margin-bottom: 20px;
}
</style>
