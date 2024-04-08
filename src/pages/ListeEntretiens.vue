<template>
  <div class="liste-entretiens">
    <h1>Liste des entretiens</h1>
    <div v-if="entretiens.length === 0">
      <p>Aucun entretien trouvé.</p>
    </div>
    <div v-else>
      <div class="q-gutter-md flex justify-center">
        <transition-group name="fade">
          <q-card v-for="entretien in entretiens" :key="entretien.id" class="my-card q-col-md-6">
            <div class="card-content">
              <q-card-section>
                <q-card-section class="q-pt-xs">
                  <div class="text-overline">Manager: {{ getUserName(entretien.manager) }}</div>
                  <div class="text-h5 q-mt-sm q-mb-xs">
                    Managé: {{ getUserName(entretien.employee) }}
                  </div>
                  <div class="text-caption text-grey">
                    Date: {{ formatDate(entretien.datetime) }}
                  </div>
                  <div class="text-caption text-grey">
                    Type d'entretien: {{ getTypeEntretien(entretien.type.value) }}
                  </div>
                  <!-- Ajoute ici d'autres informations si nécessaire -->
                </q-card-section>
              </q-card-section>

              <q-separator />

              <q-card-actions class="card-actions flex justify-center">
                <q-btn flat icon="visibility" @click="ouvrirDetailsModal(entretien)" />
                <q-btn flat icon="edit" @click="ouvrirEditerModal(entretien)" />
              </q-card-actions>
            </div>
          </q-card>
        </transition-group>
      </div>
    </div>

    <!-- Modal des détails de l'entretien -->
    <q-dialog v-model="showDetailsModal" class="details-dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Détails de l'entretien</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div>
                <p>Détails de l'entretien</p>
                <p>
                  <strong>Manager:</strong>
                  {{ (selectedEntretien && getUserName(selectedEntretien.manager)) || '' }}
                </p>
                <p>
                  <strong>Managé:</strong>
                  {{ (selectedEntretien && getUserName(selectedEntretien.employee)) || '' }}
                </p>
                <p>
                  <strong>Note du managé:</strong>
                  {{ selectedEntretien && selectedEntretien.note || '' }}
                </p>
                <p>
                  <strong>Date:</strong>
                  {{ (selectedEntretien && formatDate(selectedEntretien.datetime)) || '' }}
                </p>
                <p>
                  <strong>Type d'entretien:</strong>
                  {{ (selectedEntretien && getTypeEntretien(selectedEntretien.type.value)) || '' }}
                </p>
                <p>
                  <strong>Commentaires supplémentaires:</strong>
                  {{ (selectedEntretien && selectedEntretien.commentairesSupplementaires) || '' }}
                </p>
                <p>
                  <strong>Objectifs d'entretien:</strong>
                  {{ (selectedEntretien && selectedEntretien.objectifsEntretien) || '' }}
                </p>
                <p>
                  <strong>Objectifs managés:</strong>
                  <ul v-if="selectedEntretien && selectedEntretien.objectifsManages && selectedEntretien.objectifsManages.length > 0">
                    <li v-for="(obj, index) in selectedEntretien.objectifsManages" :key="index">
                      {{ obj.label }} • {{ obj.atteint ? 'Atteint' : 'Non Atteint' }}
                    </li>
                  </ul>
                </p>
                <p>
                  <strong>Durée:</strong>
                  {{ (selectedEntretien && selectedEntretien.duration) || '' }}
                </p>
              </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Fermer" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditerModal">
      <div class="q-pa-md">
        <q-card>
          <q-card-section>
            <q-date v-model="selectedDate" label="Date de l'entretien" />
            <q-time v-model="selectedTime" label="Heure de l'entretien" />
            <q-input
              v-model="duration"
              label="Durée prévue de l'entretien (en minutes)"
              type="number"
            />
            <q-select v-model="selectedType" :options="types" label="Type d'entretien" />
            <q-input v-model="otherDetails" label="Autres détails de l'entretien" type="textarea" />

            <!-- Nouveaux champs ajoutés -->
            <div v-for="(objectif, index) in objectifsManages" :key="index">
              <q-input
                v-model="objectif.label"
                :label="'Objectif ' + (index + 1)"
                @input="mettreAJourObjectif(index, 'label', $event)"
              />
              <q-checkbox
                v-model="objectif.atteint"
                label="Atteint"
                @change="mettreAJourObjectif(index, 'atteint', $event)"
              />
              <q-btn label="Supprimer" @click="supprimerObjectif(index)" />
            </div>

            <q-btn label="Ajouter un objectif" @click="ajouterObjectif" />

            <q-input
              v-model="objectifsEntretien"
              label="Objectifs de l'entretien"
              type="textarea"
            />

            <q-input
              v-model="note"
              label="Note attribuée au managé"
              type="number"
              :min="0"
              :max="10"
            />
            <q-input
              v-model="commentairesSupplementaires"
              label="Commentaires supplémentaires"
              type="textarea"
            />

            <!-- Affichage des erreurs de validation -->
            <q-banner v-if="formError" color="negative">{{ formError }}</q-banner>

            <!-- Bouton de soumission du formulaire -->
            <q-btn
              type="submit"
              label="Enregistrer les modifications"
              color="primary"
              :disable="isSubmitting"
              @click="sauvegarderEditerModal"
            />

            <q-btn label="Annuler" color="negative" @click="fermerEditerModal" />
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useEntretiensStore } from '../stores/EntretiensStore'
import { useUsersStore } from '../stores/UsersStore'

const usersStore = useUsersStore()
const entretiensStore = useEntretiensStore()

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
// Déclarez objectifsManages comme réactif et initialisez-le avec un tableau vide
const objectifsManages = reactive([])

const managers = ref([])
const types = ref([
  { label: 'Entretien annuel', value: 'annuel' },
  { label: 'Entretien de suivi', value: 'suivi' },
  { label: 'Évaluation de performance', value: 'performance' }
])

const showDetailsModal = ref(false)
const showEditerModal = ref(false)

onMounted(() => {
  // Chargement des utilisateurs et des entretiens
  usersStore.loadUsers()
  entretiensStore.loadEntretiens()

  entretiens.value = entretiensStore.entretiens

  // Mettre à jour la liste des managers
  managers.value = usersStore.users
    .filter((user) => user.role === 'manager')
    .map((user) => ({ label: user.nom, value: user.id }))
})

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
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error)
    formError.value = 'Une erreur est survenue lors de la soumission du formulaire'
  } finally {
    isSubmitting.value = false
  }
}

const isPast = (date) => {
  const entretienDate = new Date(date)
  const today = new Date()
  return entretienDate < today
}

const isToday = (date) => {
  const entretienDate = new Date(date)
  const today = new Date()
  return entretienDate.toDateString() === today.toDateString()
}

const ouvrirDetailsModal = (entretien) => {
  selectedEntretien.value = entretien
  showDetailsModal.value = true
}

const fermerDetailsModal = () => {
  showDetailsModal.value = false
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

<style scoped>
.liste-entretiens {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.my-card {
  max-width: 400px; /* Définis une largeur maximale pour la carte */
  margin-bottom: 20px; /* Ajoute un espacement vertical entre les cartes */
}

.card-content {
  background-color: #f5f5f5; /* Ajoute un arrière-plan aux cartes */
  padding: 10px; /* Ajoute des marges intérieures aux cartes */
}

.card-actions {
  background-color: #ffffff; /* Arrière-plan pour les actions de la carte */
  margin-top: 10px; /* Ajoute un espace au-dessus des actions */
  border-top: 1px solid #e0e0e0; /* Ajoute une bordure au-dessus des actions */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.details-dialog {
  max-width: 800px; /* Largeur maximale de la modal */
  width: 90%; /* Ajuste la largeur en pourcentage pour s'adapter à l'écran */
  max-height: 70vh; /* Hauteur maximale de la modal */
  height: 90%; /* Ajuste la hauteur en pourcentage pour s'adapter à l'écran */
}

.scroll {
  overflow-y: auto; /* Ajoute un défilement vertical si le contenu dépasse la hauteur maximale */
}
</style>
