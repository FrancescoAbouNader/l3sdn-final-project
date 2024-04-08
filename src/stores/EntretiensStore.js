import { defineStore } from 'pinia'

export const useEntretiensStore = defineStore('entretiens', {
  state: () => ({
    entretiens: []
  }),
  actions: {
    loadEntretiens() {
      const savedEntretiens = localStorage.getItem('entretiens')
      if (savedEntretiens) {
        this.entretiens = JSON.parse(savedEntretiens)
      }
    },
    addEntretien(entretien) {
      // Attribuer un identifiant unique à l'entretien
      const id = Date.now().toString() // Utilisation du timestamp comme identifiant
      entretien.id = id

      this.entretiens.push(entretien)
      this.saveEntretiens()
    },
    updateEntretien(updatedEntretien) {
      const index = this.entretiens.findIndex((entretien) => entretien.id === updatedEntretien.id)
      if (index !== -1) {
        console.log('FOUNDED')
        console.log(updatedEntretien)
        // Mettre à jour les propriétés de l'entretien
        this.entretiens[index] = { ...this.entretiens[index], ...updatedEntretien }
        console.log('Actual value')
        console.log(this.entretiens[index])
        this.saveEntretiens()
      } else {
        console.error('Entretien non trouvé')
      }
    },
    saveEntretiens() {
      localStorage.setItem('entretiens', JSON.stringify(this.entretiens))
    }
  }
})
