<template>
  <q-page class="flex flex-center">

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/boot/axios'

const result = api.get('https://rod-apps-restis-api-01.azurewebsites.net/api/sepande-group/users')

console.log(result) //console.log(result)

export default defineComponent({
  name: 'IndexPage'
})
</script>
