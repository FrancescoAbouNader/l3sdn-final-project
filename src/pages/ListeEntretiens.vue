<template>
  <div class="liste-entretiens">
    <h1 class="text-primary animate__animated animate__fadeInDown">Liste des entretiens</h1>
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
                          <q-btn flat icon="edit" class="animate__animated animate__fadeInUp animate__delay-3s" @click="ouvrirEditerModal(entretien)">
                              <q-tooltip>Éditer l'entretien</q-tooltip>
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

    <q-dialog v-model="showEditerModal">
      <q-card class="bg-white text-black" style="width: 700px; max-width: 90vw;">
          <q-bar class="bg-primary text-white rounded-borders">
              <div class="text-h6">Éditer l'entretien</div>
              <q-space />
              <q-btn v-close-popup dense flat icon="close">
                  <q-tooltip>Fermer</q-tooltip>
              </q-btn>
          </q-bar>

          <q-card-section class="q-pa-md" style="max-height: 60vh; overflow-y: auto;">
              <div class="text-body1">
                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Date de l'entretien</div>
                      <q-input v-model="selectedDate" filled mask="date" class="animate__animated animate__fadeInUp">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                      <q-date v-model="selectedDate" label="Date de l'entretien">
                                          <div class="row items-center justify-end">
                                              <q-btn v-close-popup label="Fermer" color="primary" flat />
                                          </div>
                                      </q-date>
                                  </q-popup-proxy>
                              </q-icon>
                          </template>
                      </q-input>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Heure de l'entretien</div>
                      <q-input v-model="selectedTime" filled mask="time" class="animate__animated animate__fadeInUp animate__delay-1s">
                          <template v-slot:append>
                              <q-icon name="access_time" class="cursor-pointer">
                                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                      <q-time v-model="selectedTime" label="Heure de l'entretien">
                                          <div class="row items-center justify-end">
                                              <q-btn v-close-popup label="Fermer" color="primary" flat />
                                          </div>
                                      </q-time>
                                  </q-popup-proxy>
                              </q-icon>
                          </template>
                      </q-input>
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Durée prévue de l'entretien (en minutes)</div>
                      <q-input v-model="duration" type="number" filled class="animate__animated animate__fadeInUp animate__delay-2s" />
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Type d'entretien</div>
                      <q-select v-model="selectedType" :options="types" filled class="animate__animated animate__fadeInUp animate__delay-3s" />
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Autres détails de l'entretien</div>
                      <q-input v-model="otherDetails" type="textarea" filled class="animate__animated animate__fadeInUp animate__delay-4s" />
                  </div>

                  <div class="q-mb-md">
                    <div class="text-subtitle2 q-mb-xs">Objectifs managés</div>
                    <div v-for="(objectif, index) in objectifsManages" :key="index" class="q-mb-sm animate__animated animate__fadeInUp animate__delay-1s">
                      <div class="row items-center q-col-gutter-md">
                        <div class="col-8">
                          <q-input v-model="objectif.label" :label="'Objectif ' + (index + 1)" filled class="animate__animated animate__fadeInLeft animate__delay-2s" @input="mettreAJourObjectif(index, 'label', $event)" />
                        </div>
                        <div class="col-3">
                          <q-checkbox v-model="objectif.atteint" label="Atteint" class="q-ma-none animate__animated animate__fadeInRight animate__delay-3s" />
                        </div>
                        <div class="col-1">
                          <q-btn flat round icon="delete" color="negative" class="animate__animated animate__fadeInRight animate__delay-4s" @click="supprimerObjectif(index)">
                            <q-tooltip>Supprimer</q-tooltip>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                    <q-btn label="Ajouter un objectif" color="primary" class="animate__animated animate__fadeInUp animate__delay-5s" @click="ajouterObjectif" />
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Objectifs de l'entretien</div>
                      <q-input v-model="objectifsEntretien" type="textarea" filled class="animate__animated animate__fadeInUp animate__delay-7s" />
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Note attribuée au managé</div>
                      <q-input v-model="note" type="number" :min="0" :max="10" filled class="animate__animated animate__fadeInUp animate__delay-8s" />
                  </div>

                  <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-xs">Commentaires supplémentaires</div>
                      <q-input v-model="commentairesSupplementaires" type="textarea" filled class="animate__animated animate__fadeInUp animate__delay-9s" />
                  </div>

                  <q-banner v-if="formError" color="negative" class="animate__animated animate__fadeInUp animate__delay-10s">{{ formError }}</q-banner>

                  <div class="q-mt-md animate__animated animate__fadeInUp animate__delay-11s">
                      <q-btn type="submit" label="Enregistrer les modifications" color="primary" class="q-mr-sm" :disable="isSubmitting" @click="sauvegarderEditerModal" />
                      <q-btn label="Annuler" color="negative" @click="fermerEditerModal" />
                  </div>
              </div>
          </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useEntretiensStore } from '../stores/EntretiensStore'
import { useUsersStore } from '../stores/UsersStore'

const usersStore = useUsersStore()
const entretiensStore = useEntretiensStore()

const currentUser = usersStore.currentUser

const entretiens = ref([])
const selectedEntretien = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const duration = ref(null)
const selectedType = ref(null)
const otherDetails = ref('')
const objectifsEntretien = ref('')
const note = ref(null)
const commentairesSupplementaires = ref('')
const formError = ref('')
const isSubmitting = ref(false)
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

const objectifsManages = reactive([])

//const managers = ref([])
const types = ref([
  { label: 'Entretien annuel', value: 'annuel' },
  { label: 'Entretien de suivi', value: 'suivi' },
  { label: 'Évaluation de performance', value: 'performance' }
])

const showDetailsModal = ref(false)
const showEditerModal = ref(false)

/*
onMounted(() => {
  usersStore.loadUsers()
  entretiensStore.loadEntretiens()

  entretiens.value = entretiensStore.entretiens

  managers.value = usersStore.users
    .filter((user) => user.role === 'manager')
    .map((user) => ({ label: user.nom, value: user.id }))

    mettreAJourEntretiensAfficher()
})
*/

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

// Fonction pour ajouter un nouvel objectif
const ajouterObjectif = () => {
  objectifsManages.push({ label: '', atteint: false })
}

// Fonction pour mettre à jour un objectif dans objectifsManages
const mettreAJourObjectif = (index, champ, valeur) => {
  objectifsManages[index][champ] = valeur
}

// Fonction pour supprimer un objectif de objectifsManages
const supprimerObjectif = (index) => {
  objectifsManages.splice(index, 1)
}

const submitForm = async () => {
  if (!selectedDate.value || !selectedTime.value || !duration.value || !selectedType.value) {
    formError.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  try {
    isSubmitting.value = true

    const updatedEntretien = {
      ...selectedEntretien.value,
      datetime: new Date(selectedDate.value + ' ' + selectedTime.value),
      duration: parseInt(duration.value),
      type: selectedType.value,
      otherDetails: otherDetails.value,
      objectifsManages: objectifsManages.map((obj) => ({
        label: obj.label,
        atteint: obj.atteint
      })),
      objectifsEntretien: objectifsEntretien.value,
      note: note.value !== null ? parseInt(note.value) : null,
      commentairesSupplementaires: commentairesSupplementaires.value
    }

    await entretiensStore.updateEntretien(updatedEntretien)
    showEditerModal.value = false
  } catch (error) {
    //console.error('Erreur lors de la soumission du formulaire :', error)
    formError.value = 'Une erreur est survenue lors de la soumission du formulaire'
  } finally {
    isSubmitting.value = false
  }
}

const ouvrirDetailsModal = (entretien) => {
  selectedEntretien.value = entretien
  showDetailsModal.value = true
  selectedTime.value = new Date(entretien.datetime).toISOString().substr(11, 5)
  //console.log(selectedTime.value)
}

const ouvrirEditerModal = (entretien) => {
  selectedEntretien.value = entretien
  selectedDate.value = new Date(entretien.datetime).toISOString().substr(0, 10)
  selectedTime.value = new Date(entretien.datetime).toISOString().substr(11, 5)
  duration.value = entretien.duration
  selectedType.value = entretien.type
  otherDetails.value = entretien.otherDetails
  if (entretien.objectifsManages == null) {
    objectifsManages.length = 0
  } else {
    Object.assign(objectifsManages, entretien.objectifsManages)
  }
  objectifsEntretien.value = entretien.objectifsEntretien || ''
  note.value = entretien.note
  commentairesSupplementaires.value = entretien.commentairesSupplementaires || ''
  showEditerModal.value = true
}

const fermerEditerModal = () => {
  resetValue()
  showEditerModal.value = false
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

const sauvegarderEditerModal = () => {
  submitForm()
}

const resetValue = () => {
  selectedEntretien.value = null
  selectedDate.value = null
  selectedTime.value = null
  duration.value = null
  selectedType.value = null
  otherDetails.value = ''
  objectifsManages.length = 0
  objectifsEntretien.value = ''
  note.value = null
  commentairesSupplementaires.value = ''
}
</script>

