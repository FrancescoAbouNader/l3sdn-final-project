<template>
  <div class="profile-page q-pa-md" :class="{ 'profile-page-dark': $q.dark.isActive }">
    <h1 class="text-primary animate__animated animate__fadeInDown">Mon Profil</h1>

    <q-card class="profile-card q-pa-lg animate__animated animate__fadeInUp">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="user-avatar animate__animated animate__fadeInLeft">
            <q-avatar size="100px" color="primary" text-color="white">
              {{ getInitials(currentUser.nom) }}
            </q-avatar>
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div class="user-info animate__animated animate__fadeInRight">
            <h2 class="text-h5 q-mb-md">{{ currentUser.nom }}</h2>
            <div class="q-mb-sm">
              <span class="text-subtitle2">Rôle:</span>
              <span class="text-weight-bold">{{ currentUser.role }}</span>
            </div>
            <div class="q-mb-sm">
              <span class="text-subtitle2">Email:</span>
              <span class="text-weight-bold">{{ currentUser.email }}</span>
            </div>
            <div class="q-mb-sm">
              <span class="text-subtitle2">Téléphone:</span>
              <span class="text-weight-bold">{{ currentUser.telephone }}</span>
            </div>
            <div class="q-mb-sm">
              <span class="text-subtitle2">Date d'embauche:</span>
              <span class="text-weight-bold">{{ formatDate(currentUser.dateEmbauche) }}</span>
            </div>
            <div class="q-mb-sm">
              <span class="text-subtitle2">Département:</span>
              <span class="text-weight-bold">{{ currentUser.departement }}</span>
            </div>
            <div class="q-mb-sm">
              <span class="text-subtitle2">Poste:</span>
              <span class="text-weight-bold">{{ currentUser.poste }}</span>
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div class="edit-profile animate__animated animate__fadeInUp">
        <h3 class="text-h6 q-mb-md">Modifier mon profil</h3>
        <q-form @submit.prevent="updateProfile">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="updatedUser.email"
                label="Email"
                filled
                :rules="[val => !!val || 'Veuillez saisir un email']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="updatedUser.telephone"
                label="Téléphone"
                filled
                :rules="[val => !!val || 'Veuillez saisir un numéro de téléphone']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="updatedUser.password"
                type="password"
                label="Nouveau mot de passe"
                filled
                :rules="[val => !!val || 'Veuillez saisir un mot de passe']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="updatedUser.confirmPassword"
                type="password"
                label="Confirmer le mot de passe"
                filled
                :rules="[val => !!val || 'Veuillez confirmer le mot de passe']"
              />
            </div>
          </div>
          <q-banner v-if="formError" color="negative" class="q-mt-md animate__animated animate__fadeInUp">
            {{ formError }}
          </q-banner>
          <div class="q-mt-md animate__animated animate__fadeInUp">
            <q-btn type="submit" label="Enregistrer les modifications" color="primary" class="q-mr-sm" :disable="isSubmitting" />
            <q-btn label="Annuler" color="negative" @click="resetForm" />
          </div>
        </q-form>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUsersStore } from '../stores/UsersStore'

const usersStore = useUsersStore()
const currentUser = usersStore.currentUser

const updatedUser = ref({
  email: currentUser.email,
  telephone: currentUser.telephone,
  password: '',
  confirmPassword: ''
})

const formError = ref('')
const isSubmitting = ref(false)

const getInitials = (name) => {
  const parts = name.split(' ')
  let initials = ''
  for (const part of parts) {
    initials += part.charAt(0).toUpperCase()
  }
  return initials
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const updateProfile = async () => {
  if (updatedUser.value.password !== updatedUser.value.confirmPassword) {
    formError.value = 'Les mots de passe ne correspondent pas'
    return
  }

  try {
    isSubmitting.value = true
    await usersStore.updateProfil({
      ...currentUser,
      email: updatedUser.value.email,
      telephone: updatedUser.value.telephone,
      password: updatedUser.value.password
    })
    formError.value = ''
  } catch (error) {
    formError.value = 'Une erreur est survenue lors de la mise à jour du profil'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  updatedUser.value = {
    email: currentUser.email,
    telephone: currentUser.telephone,
    password: '',
    confirmPassword: ''
  }
  formError.value = ''
}
</script>

<style lang="scss" scoped>
.profile-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profile-page-dark {
  background-color: #333 !important;
  color: #fff !important;
}

.profile-card--light {
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.edit-profile {
  margin-top: 2rem;
}
</style>
