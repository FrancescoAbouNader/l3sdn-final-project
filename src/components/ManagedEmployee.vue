<template>
  <div class="managed-employee">
    <div>Nom d'utilisateur : {{ employee.username }}</div>
    <div>Mot de passe : {{ employee.password }}</div>
  </div>
</template>

<script>
export default {
  name: 'ManagedEmployee',
  props: {
    employee: Object
  }
}
</script>

<style scoped>
.managed-employee {
  margin-bottom: 10px;
}
</style>
