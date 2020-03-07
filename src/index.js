import React from 'react'
import { render } from 'react-dom'

import NotesApp from 'components/NotesApp'

import 'styles/style.css'

const startup = () => {
  render(<NotesApp />, document.getElementById('root'))
}

if (window.cordova) {
  document.addEventListener('deviceready', startup, false)
} else {
  document.addEventListener('DOMContentLoaded', startup, false)
}
