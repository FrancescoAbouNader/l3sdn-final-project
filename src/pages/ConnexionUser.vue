<template>
  <div class="page">
    <q-page>
      <h1>Bienvenue Utilisateur {{ username }}</h1>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'ConnexionUser',
  data() {
    return {
      username: this.$route.params.username
    }
  }
}
</script>
