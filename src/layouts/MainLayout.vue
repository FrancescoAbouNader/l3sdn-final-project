<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <div class="header-content">
          <div class="user-info">
            <q-avatar size="40px" color="primary" text-color="white" class="q-mr-md">
              <div class="avatar-background"></div>
              {{ getInitials(currentUser.nom) }}
            </q-avatar>
            <div class="user-name">
              <span>{{ currentUser.nom }}</span>
              <span class="user-role text-weight-bold">{{ currentUser.role }}</span>
            </div>
          </div>
          <div class="header-actions">
            <q-btn flat dense round icon="dark_mode" @click="toggleDarkMode" />
            <q-btn flat round icon="settings" to="/mon-profil" />
            <q-btn flat round icon="logout" @click="logout" />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :mini="miniMode" @click.capture="toggleMiniMode">
    <q-list>
      <q-item
        v-for="link in essentialLinks"
        :key="link.title"
        :to="link.link"
        clickable
        :class="{ 'active': $route.path === link.link }"
        :exact-active-class="'active'"
        exact
        as="router-link"
      >
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
          <q-item-label caption>{{ link.caption }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../stores/UsersStore'
import {useQuasar} from 'quasar'

const linksList = [
  {
    title: 'Connexion',
    icon: 'account_circle',
    link: '/connexion'
  },
  {
    title: 'Accueil',
    icon: 'home',
    link: '/accueil'
  },
  {
    title: 'Liste des utilisateurs',
    icon: 'group',
    link: '/employees'
  },
  {
    title: 'Planifier un entretien',
    icon: 'event',
    link: '/planifier-entretien'
  },
  {
    title: 'Mes entretiens',
    icon: 'event_note',
    link: '/mes-entretiens'
  },
  {
    title: 'Mes entretiens planifiés',
    icon: 'schedule',
    link: '/liste-entretiens'
  },
  {
    title: 'Mon profil',
    icon: 'account_circle',
    link: '/mon-profil'
  }
]

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false)
    const darkModeEnabled = ref(false)
    const router = useRouter()
    const usersStore = useUsersStore()
    const miniMode =  ref(true)

    const currentUser = usersStore.currentUser

    const $q = useQuasar()
    const toggleDarkMode = () => {
      $q.dark.toggle()
      darkModeEnabled.value = $q.dark.isActive

      if ($q.dark.isActive) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }

    const toggleMiniMode = () => {
      miniMode.value = !miniMode.value
    }

    const logout = () => {
      usersStore.logout()
      router.push('/connexion')
    }

    const getInitials = (name) => {
      const parts = name.split(' ')
      let initials = ''
      for (const part of parts) {
        initials += part.charAt(0).toUpperCase()
      }
      return initials
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      currentUser,
      miniMode,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout,
      getInitials,
      toggleDarkMode,
      toggleMiniMode
    }
  }
})
</script>

<style scoped>
.router-link {
  text-decoration: none;
  color: inherit;
}

.router-link:hover {
  background-color: #f5f5f5;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.header-actions .q-btn {
  margin-left: 12px;
}

.avatar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e9e9e9;
  border-radius: 50%;
  z-index: -1;
}

.user-role {
  color: #d1d1d1;
  font-size: 0.8rem;
}



.body--dark{
  background-color: black;
  color: white
}

.body--light{
  background-color: white;
  color: black
}
</style>
