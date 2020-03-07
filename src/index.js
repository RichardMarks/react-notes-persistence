import React from 'react'
import { render } from 'react-dom'

import NotesApp from 'components/NotesApp'

import notesStorageService from 'state/notesStorageService'

import 'styles/style.css'

const startup = () => {
  if (!notesStorageService.useIndexedDB()) {
    if (!notesStorageService.useLocalStorage()) {
      window.alert('No persistence option is available - Notes cannot be saved on this device!')
    }
  }
  render(<NotesApp />, document.getElementById('root'))
}

if (window.cordova) {
  document.addEventListener('deviceready', startup, false)
} else {
  document.addEventListener('DOMContentLoaded', startup, false)
}
