<template>
  <div class="page">
    <q-page>
      <h1>Bienvenue Administrateur {{ username }}</h1>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'ConnexionAdmin',
  data () {
    return {
      username: 'admin'
    }
  }
}
</script>
