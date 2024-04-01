<template>
  <q-page>
    <div class="managed-employees-list">
      <h2>Liste des employés gérés</h2>
      <ManagedEmployee
        v-for="employee in managedEmployees"
        :key="employee.id"
        :employee="employee"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import ManagedEmployee from '../components/ManagedEmployee.vue'
import { users } from '../components/auth.js'

export default defineComponent({
  name: 'ManagedEmployeesPage',
  components: {
    ManagedEmployee
  },
  data() {
    return {
      managedEmployees: users // Utilisez les données d'utilisateurs provenant de auth.js
    }
  }
})
</script>

<style scoped>
/* Styles spécifiques à la page des employés gérés */
</style>
