const notesStorageService = {
  async fetchNotes () {
    let notes = []
    try {
      notes = JSON.parse(window.localStorage.getItem('notes'))
    } catch (err) {
      console.error(err)
      notes = []
    }
    return notes || []
  },
  async submitNotes ($notes) {
    try {
      window.localStorage.setItem('notes', JSON.stringify($notes))
    } catch (err) {
      console.error(err)
    }
    const saved = await notesStorageService.fetchNotes()
    return saved.length === $notes.length
  }
}

export default notesStorageService
