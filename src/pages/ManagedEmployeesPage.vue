<template>
  <q-page>
    <div class="managed-employees-list">
      <h2>Liste des employés gérés</h2>
      <ManagedEmployee
        v-for="employee in managedEmployees"
        :key="employee.username"
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
      managedEmployees: []
    }
  },
  created() {
    this.loadManagedEmployees()
  },
  methods: {
    loadManagedEmployees() {
      // Charger les données des employés gérés à partir du fichier auth.js
      this.managedEmployees = users
    }
  }
})
</script>

<style scoped>
/* Styles spécifiques à la page des employés gérés */
</style>
