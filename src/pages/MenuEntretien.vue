<template>
  <q-page-container>
    <div>
      <q-btn-group flat>
        <q-btn to="/planifier-entretien">Planifier un entretien</q-btn>
        <q-btn to="/liste-entretiens">Liste des entretiens</q-btn>
        <q-btn to="/mes-entretiens">Mes entretiens</q-btn>
      </q-btn-group>
    </div>
    <router-view />
  </q-page-container>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  name: String
})
</script>
