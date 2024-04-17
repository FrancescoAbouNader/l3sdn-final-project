<template>
  <div class="bento-box q-pa-md q-gutter-md">
    <q-card
      v-for="(item, index) in filteredBentoItems"
      :key="index"
      class=" bento-item animate__animated animate__fadeInUp animate__delay-1s"
      :class="`item${index + 1}`"
    >
      <router-link :to="item.link" style="text-decoration: none; color: #000;">
        <q-card-section>
          <div class="row items-center no-wrap">
            <q-icon :name="item.icon" size="2rem" class="q-mr-md" />
            <div>
              <div class="text-h6">{{ item.title }}</div>
              <div class="text-body2">{{ item.content }}</div>
            </div>
          </div>
        </q-card-section>
      </router-link>
    </q-card>
  </div>
</template>

<script setup>
import { useUsersStore } from '../stores/UsersStore'
import { ref, computed } from 'vue'

const bentoItems = ref([
  { title: 'Les Employés', content: 'Consultez la liste des employés de l\'entreprise et accédez à leurs informations.', link: '/employees', icon: 'people', roles: ['RH', 'manager'] },
  { title: 'Planifier un Entretien', content: 'Planifiez un nouvel entretien avec un employé en quelques étapes simples.', link: '/planifier-entretien', icon: 'event_note', roles: ['RH', 'manager'] },
  { title: 'Mes Entretiens', content: 'Retrouvez tous les entretiens passés et à venir dans votre agenda.', link: '/mes-entretiens', icon: 'calendar_today', roles: ['RH', 'manager', 'employee'] },
  { title: 'Mes Entretiens Planifiés', content: 'Accédez à l\'historique complet de vos entretiens que vous avez planifiés.', link: '/liste-entretiens', icon: 'list', roles: ['RH', 'manager'] },
  { title: 'Tous les Entretiens', content: 'Accédez à l\'historique complet des entretiens de l\'entreprise.', link: '/entretiens', icon: 'checklist', roles: ['RH'] },
  { title: 'Mon Profil', content: 'Accédez à vos informations personnelles.', link: '/mon-profil', icon: 'account_circle', roles: ['RH', 'manager', 'employee'] }
])

const usersStore = useUsersStore()
const filteredBentoItems = computed(() => {
  const currentUserRole = usersStore.currentUser?.role
  if (!currentUserRole) return []
  return bentoItems.value.filter(item => item.roles.includes(currentUserRole))
})
</script>

<style scoped>
.bento-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}


.bento-item {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
}

.bento-item:hover {
  transform: translateY(-5px) rotate(-2deg);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: #3b82f6;
}

.bento-item:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.2), transparent);
  z-index: -1;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.item1 {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

.item2 {
  grid-column: 3 / 5;
  grid-row: 1 / 2;
}

.item3 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.item4 {
  grid-column: 4 / 5;
  grid-row: 2 / 3;
}

.item5 {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
}

.item6 {
  grid-column: 4 / 5;
  grid-row: 3 / 4;
}


</style>
