import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useEntretiensStore = defineStore('entretiens', {
  state: () => ({
    entretiens: []
  }),
  actions: {
    loadEntretiens() {
      const response = api.get('/entretiens')
      response
      .then((result) => {
        this.entretiens = result.data
      })
      .catch(() => {
        this.entretiens = []
      })
    },
    addEntretien(entretien) {
      const id = Date.now().toString()
      entretien.id = id

      this.entretiens.push(entretien)
      this.saveEntretiens()
    },
    updateEntretien(updatedEntretien) {
      const index = this.entretiens.findIndex((entretien) => entretien.id === updatedEntretien.id)
      //console.log('FONDED')
      if (index !== -1) {
        //console.log(updatedEntretien)

        this.entretiens[index] = { ...this.entretiens[index], ...updatedEntretien }
        //console.log('Actual value')
        //console.log(this.entretiens[index])
        this.saveEntretiens()
      } else {
        console.error('Entretien non trouvé')
      }
    },
    saveEntretiens() {
      api.put('/entretiens', this.entretiens)
    }
  }
})
