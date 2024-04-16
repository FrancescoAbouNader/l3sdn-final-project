<template>
  <div class="q-pa-md flex flex-center login-page">
    <q-card class="login-box q-pa-lg shadow-24">
      <q-card-section>
        <div class="text-h4 q-mb-md">Connexion</div>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="email"
            label="Email"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Veuillez saisir un email']"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            v-model="password"
            label="Mot de passe"
            :type="showPassword ? 'text' : 'password'"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Veuillez saisir un mot de passe']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-btn
                :icon="showPassword ? 'visibility_off' : 'visibility'"
                flat
                @click="togglePasswordVisibility"
              />
            </template>
          </q-input>
          <q-btn
            type="submit"
            color="primary"
            label="Se connecter"
            class="full-width q-mt-md"
            :loading="loading"
            :disable="loading"
            @click="animateButton"
          />
          <q-card-section v-if="error" class="text-negative">
            {{ error }}
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup >
import { ref } from 'vue'
import { useUsersStore } from '../stores/UsersStore'
import { useRouter } from 'vue-router'

const usersStore = useUsersStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onSubmit = async () => {
  loading.value = true
  try {
    await usersStore.login(email.value, password.value)
    await router.push('/accueil')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const animateButton = () => {
  const btn = document.querySelector('.q-btn')
  btn.classList.add('animate')
  setTimeout(() => {
    btn.classList.remove('animate')
  }, 1000)
}
</script>

<style lang="scss">
.login-page {
  background: linear-gradient(45deg, #0077b6, #00b7c2);
  height: 100vh;
  width: 100%;
}

.login-box {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(25px);
  width: 400px;

  .q-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &.animate {
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        animation: ripple 1s ease-out;
      }
    }
  }
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
  }
  100% {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}
</style>
