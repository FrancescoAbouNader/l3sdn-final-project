<template>
  <div class="managed-employee">
    <div class="info">
      <span class="label">Nom :</span>
      <span>{{ employee.firstName }}</span>
    </div>
    <div class="info">
      <span class="label">Prénom :</span>
      <span>{{ employee.lastName }}</span>
    </div>
    <q-btn
      color="primary"
      label="Informations supplémentaires"
      class="info-btn"
      @click="showDetails"
    />
    <div v-if="showMore" class="more-info">
      <div class="info">
        <span class="label">Nom d'utilisateur :</span>
        <span>{{ employee.username }}</span>
      </div>
      <div class="info">
        <span class="label">Mot de passe :</span>
        <span>{{ employee.password }}</span>
      </div>
      <div class="info">
        <span class="label">Rôle :</span>
        <span>{{ employee.role }}</span>
      </div>
      <div class="info">
        <span class="label">Sexe :</span>
        <span>{{ employee.gender }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManagedEmployee',
  props: {
    employee: Object
  },
  data() {
    return {
      showMore: false
    }
  },
  methods: {
    showDetails() {
      this.showMore = !this.showMore
    }
  }
}
</script>

<style scoped>
.managed-employee {
  margin-bottom: 10px;
}

.info {
  display: inline-block;
  margin-right: 10px;
}

.label {
  font-weight: bold;
}

.info-btn {
  margin-left: 20px;
}

.more-info {
  margin-top: 10px;
}
</style>
