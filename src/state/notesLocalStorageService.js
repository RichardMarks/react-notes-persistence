const notesLocalStorageService = {
  get isAvailable () {
    return 'localStorage' in window
  },
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
    if (!$notes.length) {
      try {
        window.localStorage.removeItem('notes')
      } catch (err) {
        console.error(err)
      }
      return true
    }
    try {
      window.localStorage.setItem('notes', JSON.stringify($notes))
    } catch (err) {
      console.error(err)
      if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        window.alert('Oh no, your local storage quota was exceeded. Unable to save your notes to your browser. Be sure to export them or you will lose them.')
      }
    }
    const saved = await notesLocalStorageService.fetchNotes()
    return saved.length === $notes.length
  }
}

export default notesLocalStorageService
