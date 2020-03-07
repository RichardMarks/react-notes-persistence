import React from 'react'

import { useNotesContext } from 'state/NotesContext'
import NotesActions from 'state/NotesActions'

const NoteCTAs = () => {
  // eslint-disable-next-line no-unused-vars
  const [ notes, dispatch ] = useNotesContext()
  const createNote = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    dispatch({ type: NotesActions.CREATE_NOTE })
  }
  return (
    <React.Fragment>
      <div>
        <button onClick={createNote}>New Note</button>
      </div>
    </React.Fragment>
  )
}

export default NoteCTAs
