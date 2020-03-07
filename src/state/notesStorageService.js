import notesLocalStorageService from 'state/notesLocalStorageService'
import notesIndexedDBStorageService from 'state/notesIndexedDBStorageService'

const notesStorageService = {
  implementation: notesLocalStorageService,
  useLocalStorage () {
    if (notesLocalStorageService.isAvailable) {
      notesStorageService.implementation = notesLocalStorageService
      return true
    }
    return false
  },
  useIndexedDB () {
    if (notesIndexedDBStorageService.isAvailable) {
      notesStorageService.implementation = notesIndexedDBStorageService
      return true
    }
    return false
  },
  async fetchNotes () {
    let notes = []
    try {
      notes = await notesStorageService.implementation.fetchNotes()
    } catch (err) {
      console.error(err)
      notes = []
    }
    return notes
  },
  async submitNotes ($notes) {
    let response = null
    try {
      response = await notesStorageService.implementation.submitNotes($notes)
    } catch (err) {
      console.error(err)
      response = null
    }
    return response
  }
}

export default notesStorageService
