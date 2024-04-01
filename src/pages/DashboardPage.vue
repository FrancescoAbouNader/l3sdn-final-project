<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Nombre de managés</div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <!-- Gestionnaire d'événements pour rediriger vers la page des employés gérés -->
          <q-btn flat @click="navigateToManagedEmployees">Voir</q-btn>
        </q-card-actions>
      </q-card>

      <q-card class="my-card">
        <q-card-section class="bg-purple text-white">
          <div class="text-h6">Prochain entretien</div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn flat>Voir</q-btn>
        </q-card-actions>
      </q-card>

      <q-card class="my-card">
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">Mon manager</div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn flat>Voir</q-btn>
        </q-card-actions>
      </q-card>

      <q-card class="my-card">
        <q-card-section class="bg-grey-8 text-white">
          <div class="text-h6">Mon prochain entretien personnel</div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn flat>Voir</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DashboardPage',
  methods: {
    navigateToManagedEmployees() {
      // Redirection vers la page des employés gérés
      this.$router.push('/managed-employees')
    }
  }
})
</script>
