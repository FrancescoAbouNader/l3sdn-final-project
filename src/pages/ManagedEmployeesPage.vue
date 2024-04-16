<template>
  <div class="users-page q-pa-md">
    <h1 class="text-primary animate__animated animate__fadeInDown">Liste des Utilisateurs</h1>

    <div class="q-mb-md flex justify-between items-center animate__animated animate__fadeInUp">
      <q-input v-model="searchTerm" placeholder="Rechercher un utilisateur" filled>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn color="primary" class="q-mx-md" icon="add" label="Ajouter un utilisateur" @click="showAddUserModal = true" />
    </div>

    <div v-if="filteredUsers.length === 0" class="animate__animated animate__fadeInUp">
      <p>Aucun utilisateur trouvé.</p>
    </div>
    <div v-else>
      <q-table
        :rows="filteredUsers"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :loading="isLoading"
        class="animate__animated animate__fadeInUp"
        @update:pagination="$event => pagination = $event"
      >

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round icon="edit" color="primary" @click="showEditUserModalHandler(props.row)">
              <q-tooltip>Éditer</q-tooltip>
            </q-btn>
            <q-btn flat round icon="delete" color="negative" @click="deleteUser(props.row)">
              <q-tooltip>Supprimer</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="showAddUserModal">
      <q-card class="bg-white text-black" style="width: 600px; max-width: 90vw;">
        <q-bar class="bg-primary text-white rounded-borders">
          <div class="text-h6">Ajouter un utilisateur</div>
          <q-space />
          <q-btn v-close-popup dense flat icon="close">
            <q-tooltip>Fermer</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-md">
          <q-form @submit.prevent="addUser">
            <q-input v-model="newUser.nom" label="Nom" filled required />
            <q-input v-model="newUser.email" label="Email" filled required />
            <q-input v-model="newUser.telephone" label="Téléphone" filled required />
            <q-select v-model="newUser.role" :options="roles" label="Rôle" filled required />
            <q-input v-model="newUser.password" type="password" label="Mot de passe" filled required />
            <q-banner v-if="formError" color="negative" class="q-mt-md">{{ formError }}</q-banner>
            <div class="q-mt-md">
              <q-btn type="submit" label="Ajouter" color="primary" class="q-mr-sm" :disable="isSubmitting" />
              <q-btn label="Annuler" color="negative" @click="showAddUserModal = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditUserModal">
      <q-card class="bg-white text-black" style="width: 600px; max-width: 90vw;">
        <q-bar class="bg-primary text-white rounded-borders">
          <div class="text-h6">Éditer un utilisateur</div>
          <q-space />
          <q-btn v-close-popup dense flat icon="close">
            <q-tooltip>Fermer</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-md">
          <q-form @submit.prevent="updateUser">
            <q-input v-model="editedUser.nom" label="Nom" filled required />
            <q-input v-model="editedUser.email" label="Email" filled required />
            <q-input v-model="editedUser.telephone" label="Téléphone" filled required />
            <q-select v-model="editedUser.role" :options="roles" label="Rôle" filled required />
            <q-input v-model="editedUser.password" type="password" label="Mot de passe" filled />
            <q-banner v-if="formError" color="negative" class="q-mt-md">{{ formError }}</q-banner>
            <div class="q-mt-md">
              <q-btn type="submit" label="Enregistrer" color="primary" class="q-mr-sm" :disable="isSubmitting" />
              <q-btn label="Annuler" color="negative" @click="showEditUserModal = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '../stores/UsersStore'

const usersStore = useUsersStore()
const users = ref([])
const searchTerm = ref('')
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const editedUser = ref({})
const newUser = ref({
  nom: '',
  email: '',
  telephone: '',
  role: '',
  password: ''
})
const formError = ref('')
const isSubmitting = ref(false)
const isLoading = ref(false)
const pagination = ref({
  sortBy: 'nom',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const roles = ['RH', 'manager', 'employee']

const filteredUsers = computed(() => {
  if (!searchTerm.value) {
    return users.value
  }
  return users.value.filter(user => {
    const userName = user.nom.toLowerCase()
    return userName.includes(searchTerm.value.toLowerCase())
  })
})

const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'telephone', label: 'Téléphone', field: 'telephone', sortable: true },
  { name: 'role', label: 'Rôle', field: 'role', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions' }
]

onMounted(() => {
  loadUsers()
})

const loadUsers = async () => {
  isLoading.value = true
  users.value = await usersStore.getUsers()
  isLoading.value = false
}

const addUser = async () => {
  try {
    isSubmitting.value = true
    await usersStore.addUser(newUser.value)
    showAddUserModal.value = false
    newUser.value = {
      nom: '',
      email: '',
      telephone: '',
      role: '',
      password: ''
    }
    formError.value = ''
    loadUsers()
  } catch (error) {
    formError.value = 'Une erreur est survenue lors de l\'ajout de l\'utilisateur'
  } finally {
    isSubmitting.value = false
  }
}

const showEditUserModalHandler = (user) => {
  editedUser.value = { ...user }
  showEditUserModal.value = true
}

const updateUser = async () => {
  try {
    isSubmitting.value = true
    await usersStore.updateUser(editedUser.value)
    showEditUserModal.value = false
    formError.value = ''
    loadUsers()
  } catch (error) {
    formError.value = 'Une erreur est survenue lors de la mise à jour de l\'utilisateur'
  } finally {
    isSubmitting.value = false
  }
}

const deleteUser = async (user) => {
  try {
    await usersStore.deleteUser(user.id)
    loadUsers()
  } catch (error) {
    //console.error('Erreur lors de la suppression de l\'utilisateur :', error)
  }
}
</script>


<style lang="scss" scoped>
.users-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.users-page h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.filter-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 100%;
  max-width: 400px;
}

.filter-container .text-subtitle2 {
  font-weight: 500;
}

.q-table {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-table th,
.q-table td {
  padding: 1rem ;
}

.q-btn.q-btn--flat.q-btn--round {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.q-btn.q-btn--flat.q-btn--round:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.q-dialog__inner > div {
  border-radius: 8px;
}

.q-form .q-input {
  margin-bottom: 1rem;
}
</style>
