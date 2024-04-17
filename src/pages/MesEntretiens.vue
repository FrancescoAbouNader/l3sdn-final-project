<template>
  <div class="liste-entretiens">
    <h1 class="text-primary animate__animated animate__fadeInDown"></h1>
    <div v-if="entretiens.length === 0" class="animate__animated animate__fadeInUp">
      <p>Aucun entretien trouvé.</p>
    </div>
    <div v-else>
      <div class="q-mb-md flex justify-center">
          <div class="filter-container animate__animated animate__fadeInDown">
              <div class="text-subtitle2 q-mb-sm animate__animated animate__fadeInUp">Filtrer par date</div>
              <q-btn-toggle v-model="dateFilter" spread no-caps toggle-color="primary" :options="[
          { label: 'Passés', value: 'past', icon: 'event_busy' },
          { label: 'Aujourd\'hui', value: 'today', icon: 'event_available' },
          { label: 'À venir', value: 'future', icon: 'event_note' }
        ]" class="animate__animated animate__fadeInUp animate__delay-1s" />
          </div>
      </div>
      <div class="q-gutter-md flex justify-center">
          <transition-group name="fade">
              <q-card v-for="entretien in entretiensAfficher" :key="entretien.id" class="my-card q-col-md-6 animate__animated animate__fadeInUp animate__delay-1s">
                  <div class="card-content">
                      <q-card-section>
                          <q-card-section class="q-pt-xs">
                              <div class="text-overline text-grey-7">Manager: {{ getUserName(entretien.manager) }}</div>
                              <div class="text-h5 q-mt-sm q-mb-xs">
                                  Managé: {{ getUserName(entretien.employee) }}
                              </div>
                              <div class="text-caption text-grey-6 row items-center q-my-sm">
                                  <div class="col-auto q-mr-sm">
                                      <q-icon :name="getDateIcon(entretien.datetime)" :color="getDateColor(entretien.datetime)" size="1.5em" />
                                  </div>
                                  <div class="col">
                                      Date: {{ formatDate(entretien.datetime) }}
                                  </div>
                              </div>
                              <div class="text-caption text-grey-6">
                                  Type d'entretien: {{ getTypeEntretien(entretien.type.value) }}
                              </div>
                          </q-card-section>
                      </q-card-section>

                      <q-separator />

                      <q-card-actions class="card-actions flex justify-center">
                          <q-btn flat icon="visibility" class="animate__animated animate__fadeInUp animate__delay-2s" @click="ouvrirDetailsModal(entretien)">
                              <q-tooltip>Voir les détails</q-tooltip>
                          </q-btn>
                      </q-card-actions>
                  </div>
              </q-card>
          </transition-group>
      </div>
      <div class="q-my-md flex justify-center">
          <q-pagination v-model="pageCourante" :max="nombreDePages" :max-pages="6" boundary-links boundary-numbers color="primary" @update:model-value="mettreAJourEntretiensAfficher" />
      </div>
    </div>

    <q-dialog v-model="showDetailsModal">
      <q-card class="bg-white text-black" style="width: 700px; max-width: 90vw;">
          <q-bar class="bg-primary text-white rounded-borders">
              <div class="text-h6">Détails de l'entretien</div>
              <q-space />
              <q-btn v-close-popup dense flat icon="close">
                  <q-tooltip>Fermer</q-tooltip>
              </q-btn>
          </q-bar>

          <q-card-section class="q-pa-md" style="max-height: 60vh; overflow-y: auto;">
              <div class="text-body1">
                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Manager</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp">
                          {{ (selectedEntretien && getUserName(selectedEntretien.manager)) || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Managé</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-1s">
                          {{ (selectedEntretien && getUserName(selectedEntretien.employee)) || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Note du managé</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-2s">
                          {{ selectedEntretien && selectedEntretien.note || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Date de l'entretien</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-3s">
                          {{ (selectedEntretien && formatDate(selectedEntretien.datetime)) || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Heure de l'entretien</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-4s">
                          {{ selectedTime || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Type d'entretien</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-5s">
                          {{ (selectedEntretien && getTypeEntretien(selectedEntretien.type.value)) || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Commentaires supplémentaires</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-6s">
                          {{ (selectedEntretien && selectedEntretien.commentairesSupplementaires) || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Objectifs d'entretien</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-7s">
                          {{ (selectedEntretien && selectedEntretien.objectifsEntretien) || '' }}
                      </div>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Objectifs managés</div>
                      <q-list v-if="selectedEntretien && selectedEntretien.objectifsManages && selectedEntretien.objectifsManages.length > 0" bordered class="rounded-borders animate__animated animate__fadeInUp animate__delay-8s">
                          <q-item v-for="(obj, index) in selectedEntretien.objectifsManages" :key="index" dense>
                              <q-item-section class="bg-grey-3 q-pa-md rounded-borders text-weight-bold">{{ obj.label }}</q-item-section>
                              <q-item-section side>
                                  <q-chip :color="obj.atteint ? 'positive' : 'negative'" text-color="white" dense>
                                      {{ obj.atteint ? 'Atteint' : 'Non Atteint' }}
                                  </q-chip>
                              </q-item-section>
                          </q-item>
                      </q-list>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Durée</div>
                      <div class="bg-grey-3 q-pa-md rounded-borders text-weight-bold animate__animated animate__fadeInUp animate__delay-8s">
                          {{ (selectedEntretien && selectedEntretien.duration) || '' }}
                      </div>
                  </div>
              </div>
          </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useEntretiensStore } from '../stores/EntretiensStore'
import { useUsersStore } from '../stores/UsersStore'

const usersStore = useUsersStore()
const entretiensStore = useEntretiensStore()

const currentUser = usersStore.currentUser

const entretiens = ref([])
const selectedTime = ref(null)
const selectedEntretien = ref(null)
const pageCourante = ref(1)
const entretiensParPage = 6
const entretiensAfficher = ref([])
const dateFilter = ref('all')

const nombreDePages = computed(() => Math.ceil(filteredEntretiens.value.length / entretiensParPage))
const filteredEntretiens = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0)
  if (dateFilter.value === 'past') {
    return entretiens.value.filter(entretien => {
      const entretienDate = new Date(entretien.datetime).setHours(0, 0, 0, 0)
      return entretienDate < today
    })
  } else if (dateFilter.value === 'today') {
    return entretiens.value.filter(entretien => {
      const entretienDate = new Date(entretien.datetime).setHours(0, 0, 0, 0)
      return entretienDate === today
    })
  } else if (dateFilter.value === 'future') {
    return entretiens.value.filter(entretien => {
      const entretienDate = new Date(entretien.datetime).setHours(0, 0, 0, 0)
      return entretienDate > today
    })
  } else {
    return entretiens.value
  }
})

const showDetailsModal = ref(false)

onMounted(() => {
  usersStore.loadUsers()
  entretiensStore.loadEntretiens()
  entretiens.value = entretiensStore.entretiens.filter(entretien => entretien.manager === currentUser.id)
  mettreAJourEntretiensAfficher()
})

watch(filteredEntretiens, () => {
  mettreAJourEntretiensAfficher()
})

const getDateIcon = (datetime) => {
  const today = new Date().setHours(0, 0, 0, 0)
  const entretienDate = new Date(datetime).setHours(0, 0, 0, 0)

  if (entretienDate < today) {
    return 'event_busy'
  } else if (entretienDate === today) {
    return 'event_available'
  } else {
    return 'event_note'
  }
}

const getDateColor = (datetime) => {
  const today = new Date().setHours(0, 0, 0, 0)
  const entretienDate = new Date(datetime).setHours(0, 0, 0, 0)

  if (entretienDate < today) {
  return 'grey-7'
  } else if (entretienDate === today) {
    return 'primary'
  } else {
    return 'positive'
  }
}

const mettreAJourEntretiensAfficher = () => {
  const indexDebut = (pageCourante.value - 1) * entretiensParPage
  const indexFin = indexDebut + entretiensParPage
  entretiensAfficher.value = filteredEntretiens.value.slice(indexDebut, indexFin)
}

const ouvrirDetailsModal = (entretien) => {
  selectedEntretien.value = entretien
  showDetailsModal.value = true
  selectedTime.value = new Date(entretien.datetime).toISOString().substr(11, 5)
}

const getUserName = (userId) => {
  const user = usersStore.getUserById(userId)
  return user ? user.nom : ''
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const getTypeEntretien = (type) => {
  switch (type) {
    case 'annuel':
      return 'Entretien annuel'
    case 'suivi':
      return 'Entretien de suivi'
    case 'performance':
      return 'Évaluation de performance'
    default:
      return ''
  }
}

</script>

