<template>
  <q-page class="flex flex-center">

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/boot/axios'

const response = api.get('/users')
response.then((result) => {
  console.log(result)
}

)

export default defineComponent({
  name: 'IndexPage'
})
</script>
