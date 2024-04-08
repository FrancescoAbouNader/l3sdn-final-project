<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-form @submit="submitForm">
          <!-- Champs pour saisir les détails de l'entretien -->
          <q-select v-model="selectedManager" :options="managers" label="Sélectionner le manager" />
          <q-select
            v-model="selectedEmployee"
            :options="employees"
            label="Sélectionner le managé"
          />
          <q-date v-model="selectedDate" label="Date de l'entretien" />
          <q-time v-model="selectedTime" label="Heure de l'entretien" />
          <q-input
            v-model="duration"
            label="Durée prévue de l'entretien (en minutes)"
            type="number"
          />
          <q-select v-model="selectedType" :options="types" label="Type d'entretien" />
          <q-input v-model="otherDetails" label="Autres détails de l'entretien" />

          <!-- Affichage des erreurs de validation -->
          <q-banner v-if="formError" color="negative">{{ formError }}</q-banner>

          <!-- Bouton de soumission du formulaire -->
          <q-btn
            type="submit"
            label="Planifier l'entretien"
            color="primary"
            :disable="isSubmitting"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/UsersStore'
import { useEntretiensStore } from '../stores/EntretiensStore'

const usersStore = useUsersStore()
const entretiensStore = useEntretiensStore()

const selectedManager = ref(null)
const selectedEmployee = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const duration = ref(null)
const selectedType = ref(null)
const otherDetails = ref('')
const formError = ref('')
const isSubmitting = ref(false)

const managers = ref([])
const employees = ref([])
const types = ref([
  { label: 'Entretien annuel', value: 'annuel' },
  { label: 'Entretien de suivi', value: 'suivi' },
  { label: 'Évaluation de performance', value: 'performance' }
  // Ajoutez d'autres types d'entretien au besoin
])

onMounted(() => {
  // Chargement des utilisateurs et des entretiens
  usersStore.loadUsers()
  entretiensStore.loadEntretiens()

  // Mettre à jour la liste des managers et des employés
  managers.value = usersStore.users
    .filter((user) => user.role === 'manager')
    .map((user) => ({ label: user.nom, value: user.id }))
  employees.value = usersStore.users
    .filter((user) => user.role === 'employee')
    .map((user) => ({ label: user.nom, value: user.id }))
})

const submitForm = async () => {
  if (
    !selectedManager.value ||
    !selectedEmployee.value ||
    !selectedDate.value ||
    !selectedTime.value ||
    !duration.value ||
    !selectedType.value
  ) {
    formError.value = 'Veuillez remplir tous les champs'
    return
  }

  try {
    isSubmitting.value = true

    const entretien = {
      manager: selectedManager.value.value,
      employee: selectedEmployee.value.value,
      datetime: new Date(selectedDate.value + ' ' + selectedTime.value),
      duration: parseInt(duration.value),
      type: selectedType.value,
      details: otherDetails.value
    }

    // Ajoutez l'entretien au magasin
    await entretiensStore.addEntretien(entretien)
    console.log(entretien)

    // Réinitialisez le formulaire après une soumission réussie
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error)
    formError.value = 'Une erreur est survenue lors de la soumission du formulaire'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  selectedManager.value = null
  selectedEmployee.value = null
  selectedDate.value = null
  selectedTime.value = null
  duration.value = null
  selectedType.value = null
  otherDetails.value = ''
  formError.value = ''
}
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>
