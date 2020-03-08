const DB_NAME = 'notes'
const DB_VERSION = 1
const STORE_NAME = 'notes'

let database = null

const notesDataTransformer = {
  toBuffer (notes) {
    // input an array of notes objects
    // output an ArrayBuffer to be written to IDB
    let notesJSON = ''
    try {
      notesJSON = JSON.stringify(notes)
    } catch (err) {
      console.error(err)
      notesJSON = ''
    }
    const buffer = new ArrayBuffer(notesJSON.length * 2)
    const view = new Uint16Array(buffer)
    for (let i = 0; i < notesJSON.length; i += 1) {
      view[i] = notesJSON.charCodeAt(i)
    }
    return buffer
  },

  fromBuffer (buffer) {
    // input an ArrayBuffer from IDB
    // output an array of notes objects
    let notes = []
    let notesJSON = '[]'
    try {
      notesJSON = String.fromCharCode.apply(null, new Uint16Array(buffer))
    } catch (err) {
      console.error(err)
      notesJSON = '[]'
    }
    try {
      notes = JSON.parse(notesJSON)
    } catch (err) {
      console.error(err)
      notes = []
    }
    return notes
  }
}

const notesIndexedDBStorageService = {
  set isAvailable ($) {
    throw new Error('isAvailable is read only')
  },

  get isAvailable () {
    return 'indexedDB' in window
  },

  set db ($) {
    throw new Error('db is read only')
  },

  get db () {
    return new Promise((resolve, reject) => {
      if (database) {
        return resolve(database)
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)
      request.onerror = e => {
        reject(new Error('unable to open database'))
      }
      request.onsuccess = e => {
        database = e.target.result
        resolve(database)
      }
      request.onupgradeneeded = e => {
        const db = e.target.result
        db.createObjectStore(STORE_NAME, { keyPath: '_id' })
      }
    })
  },

  async fetchNotes () {
    const db = await notesIndexedDBStorageService.db
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      transaction.onerror = e => {
        reject(new Error('unable to start a read transaction'))
      }
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(0)
      request.onsuccess = e => {
        if (e.target.result) {
          const buffer = e.target.result.data
          const notes = notesDataTransformer.fromBuffer(buffer)
          resolve(notes)
        } else {
          resolve([])
        }
      }
    })
  },
  async submitNotes ($notes) {
    const db = await notesIndexedDBStorageService.db
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      transaction.onerror = e => {
        reject(new Error('unable to start a write transaction'))
      }
      transaction.onabort = e => {
        const err = e.target.error
        if (err.name === 'QuotaExceededError') {
          window.alert('Oh no, your local storage quota was exceeded. Unable to save your notes to your browser. Be sure to export them or you will lose them.')
        }
      }
      const store = transaction.objectStore(STORE_NAME)
      if (!$notes.length) {
        const request = store.delete(0)
        request.onsuccess = e => {
          console.log('row deleted')
          resolve(true)
        }
        request.onerror = e => {
          reject(new Error('unable to write to the store'))
        }
        return
      }
      const item = { data: notesDataTransformer.toBuffer($notes), _id: 0 }
      const request = store.put(item)
      request.onsuccess = e => {
        resolve(true)
      }
      request.onerror = e => {
        reject(new Error('unable to write to the store'))
      }
    })
  }
}

export default notesIndexedDBStorageService
