<template>
    <q-splitter v-model="splitterModel" style="height: 92vh;">
      <template v-slot:before>
        <div class="q-pa-md">
          <h4 class="text-primary animate__animated animate__fadeInDown">Planifier un entretien</h4>
          <q-stepper v-model="step" vertical color="primary" animated flat class="q-mt-md">
            <q-step :name="1" title="Sélectionner un manager" icon="assignment_ind" :done="step > 1" class="animate__animated animate__fadeInLeft">
              <q-select v-model="selectedManager" :options="managers" label="Sélectionner le manager" filled />

              <q-stepper-navigation>
                <q-btn color="primary" label="Continuer" class="animate__animated animate__fadeInUp animate__delay-0.2s" @click="step = 2" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="2" title="Sélectionner un employé" caption="Optionnel" icon="person_add" :done="step > 2" class="animate__animated animate__fadeInLeft animate__delay-1s">
              <q-select
                v-model="selectedEmployee"
                :options="filteredEmployees"
                label="Sélectionner le managé"
                filled
                use-input
                hide-selected
                @filter="filterEmployees"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Aucun employé trouvé</q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-stepper-navigation>
                <q-btn color="primary" label="Continuer" class="animate__animated animate__fadeInUp animate__delay-2s" @click="step = 3" />
                <q-btn flat color="primary" label="Retour" class="q-ml-sm animate__animated animate__fadeInUp animate__delay-3s" @click="step = 1" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="3" title="Date de l'entretien" icon="event" :done="step > 3" class="animate__animated animate__fadeInLeft animate__delay-2s">
              <q-input v-model="selectedDate" filled mask="date" class="animate__animated animate__fadeInUp animate__delay-1s">
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

              <q-stepper-navigation>
                <q-btn color="primary" label="Continuer" class="animate__animated animate__fadeInUp animate__delay-2s" @click="step = 4" />
                <q-btn flat color="primary" label="Retour" class="q-ml-sm animate__animated animate__fadeInUp animate__delay-3s" @click="step = 2" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="4" title="Heure de l'entretien" icon="schedule" :done="step > 4" class="animate__animated animate__fadeInLeft animate__delay-3s">
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

              <q-stepper-navigation>
                <q-btn color="primary" label="Continuer" class="animate__animated animate__fadeInUp animate__delay-2s" @click="step = 5" />
                <q-btn flat color="primary" label="Retour" class="q-ml-sm animate__animated animate__fadeInUp animate__delay-3s" @click="step = 3" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="5" title="Durée de l'entretien" icon="timer" :done="step > 5" class="animate__animated animate__fadeInLeft animate__delay-4s">
              <q-input v-model="duration" label="Durée de l'entretien (en minutes)" type="number" filled class="animate__animated animate__fadeInUp animate__delay-1s" />

              <q-stepper-navigation>
                <q-btn color="primary" label="Continuer" class="animate__animated animate__fadeInUp animate__delay-2s" @click="step = 6" />
                <q-btn flat color="primary" label="Retour" class="q-ml-sm animate__animated animate__fadeInUp animate__delay-3s" @click="step = 4" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="6" title="Type d'entretien" icon="description" :done="step > 6" class="animate__animated animate__fadeInLeft animate__delay-5s">
              <q-select v-model="selectedType" :options="types" label="Type d'entretien" filled class="animate__animated animate__fadeInUp animate__delay-1s" />

              <q-stepper-navigation>
                <q-btn color="primary" label="Continuer" class="animate__animated animate__fadeInUp animate__delay-2s" @click="step = 7" />
                <q-btn flat color="primary" label="Retour" class="q-ml-sm animate__animated animate__fadeInUp animate__delay-3s" @click="step = 5" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="7" title="Commentaire" icon="add_comment" :done="step > 7" class="animate__animated animate__fadeInLeft animate__delay-6s">
              <q-input v-model="otherDetails" label="Autres détails de l'entretien" filled class="animate__animated animate__fadeInUp animate__delay-1s" />

              <q-stepper-navigation>
                <q-btn color="primary" label="Terminer" class="animate__animated animate__fadeInUp animate__delay-2s"  @click="submitForm"/>
                <q-btn flat color="primary" label="Retour" class="q-ml-sm animate__animated animate__fadeInUp animate__delay-3s" @click="step = 6" />
              </q-stepper-navigation>
            </q-step>

            <q-banner v-if="formError" color="negative" class="animate__animated animate__fadeInUp animate__delay-10s">{{ formError }}</q-banner>
            <q-btn class="q-ma-md animate__animated animate__fadeInUp animate__delay-11s" color="dark" label="Reprendre" @click="resetForm" />
          </q-stepper>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <h4 class="text-primary animate__animated animate__fadeInDown">Résumé du formulaire</h4>
          <div class="summary-container q-pa-md animate__animated animate__fadeInUp">
            <div v-if="step > 1" class="summary-item animate__animated animate__fadeInUp animate__delay-1s">
              <div class="summary-label">Manager sélectionné</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ selectedManager.label }}</div>
            </div>
            <div v-if="step > 2" class="summary-item animate__animated animate__fadeInUp animate__delay-2s">
              <div class="summary-label">Employé sélectionné</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ selectedEmployee.label }}</div>
            </div>
            <div v-if="step > 3" class="summary-item animate__animated animate__fadeInUp animate__delay-3s">
              <div class="summary-label">Date de l'entretien</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ selectedDate }}</div>
            </div>
            <div v-if="step > 4" class="summary-item animate__animated animate__fadeInUp animate__delay-4s">
              <div class="summary-label">Heure de l'entretien</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ selectedTime }}</div>
            </div>
            <div v-if="step > 5" class="summary-item animate__animated animate__fadeInUp animate__delay-5s">
              <div class="summary-label">Durée de l'entretien</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ duration }} minutes</div>
            </div>
            <div v-if="step > 6" class="summary-item animate__animated animate__fadeInUp animate__delay-6s">
              <div class="summary-label">Type d'entretien</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ selectedType.label }}</div>
            </div>
            <div v-if="step > 7" class="summary-item animate__animated animate__fadeInUp animate__delay-7s">
              <div class="summary-label">Autres détails de l'entretien</div>
              <div class="summary-text bg-grey-3 rounded-borders glassmorphism">{{ otherDetails }}</div>
            </div>
          </div>
        </div>
      </template>

    </q-splitter>

</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUsersStore } from '../stores/UsersStore'
import { useEntretiensStore } from '../stores/EntretiensStore'

const usersStore = useUsersStore()
const entretiensStore = useEntretiensStore()

const step = ref(1)

const selectedManager = ref(null)
const selectedEmployee = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const duration = ref(null)
const selectedType = ref(null)
const otherDetails = ref('')
const formError = ref('')
const isSubmitting = ref(false)
const splitterModel = ref(50)
const searchTerm = ref('')

const managers = ref([])
const employees = ref([])
const types = ref([
  { label: 'Entretien annuel', value: 'annuel' },
  { label: 'Entretien de suivi', value: 'suivi' },
  { label: 'Évaluation de performance', value: 'performance' }
])

onMounted(() => {
  usersStore.loadUsers()
  entretiensStore.loadEntretiens()

  managers.value = usersStore.users
    .filter((user) => user.role === 'manager')
    .map((user) => ({ label: user.nom, value: user.id }))
  employees.value = usersStore.users
    .filter((user) => user.role === 'employee')
    .map((user) => ({ label: user.nom, value: user.id }))
})

const filteredEmployees = computed(() => {
  if (!searchTerm.value) {
    return employees.value
  }
  return employees.value.filter(employee => {
    const employeeName = employee.label.toLowerCase()
    return employeeName.includes(searchTerm.value.toLowerCase())
  })
})

const filterEmployees = (val, update) => {
  if (val === '') {
    update(() => {
      searchTerm.value = ''
    })
    return
  }

  update(() => {
    searchTerm.value = val.toLowerCase()
  })
}


const submitForm = async () => {
  if (
    !selectedManager.value ||
    !selectedEmployee.value ||
    !selectedDate.value ||
    !selectedTime.value ||
    !duration.value ||
    !selectedType.value
  ) {
    formError.value = 'Veuillez remplir tous les champs'
    return
  }

  try {
    isSubmitting.value = true

    const entretien = {
      manager: selectedManager.value.value,
      employee: selectedEmployee.value.value,
      datetime: new Date(selectedDate.value + ' ' + selectedTime.value),
      duration: parseInt(duration.value),
      type: selectedType.value,
      details: otherDetails.value
    }

    await entretiensStore.addEntretien(entretien)
    //console.log(entretien)
    step.value = 1
    formError.value = ''

    resetForm()
  } catch (error) {
    //console.error('Erreur lors de la soumission du formulaire :', error)
    formError.value = 'Une erreur est survenue lors de la soumission du formulaire'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  selectedManager.value = null
  selectedEmployee.value = null
  selectedDate.value = null
  selectedTime.value = null
  duration.value = null
  selectedType.value = null
  otherDetails.value = ''
  formError.value = ''
  step.value = 1
}
</script>

<style scoped>
.summary-container {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.summary-item {
  margin-bottom: 1rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.summary-text {
  padding: 0.5rem 1rem;
  color: #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.summary-text::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  z-index: -1;
  opacity: 0;
  transition: all 0.3s ease;
}

.summary-text:hover::before {
  opacity: 1;
}

.glassmorphism {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>
