import React from 'react'

import { useNotesContext } from 'state/NotesContext'
import NotesActions from 'state/NotesActions'

const NoteCTAs = () => {
  const [ notes, dispatch ] = useNotesContext()
  const createNote = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    dispatch({ type: NotesActions.CREATE_NOTE })
  }
  const exportNotes = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    dispatch({ type: NotesActions.EXPORT_NOTES })
  }
  return (
    <React.Fragment>
      <div>
        <button onClick={createNote}>New Note</button>
        <button disabled={!notes.length} style={{ marginLeft: 10 }} onClick={exportNotes}>Export Notes</button>
      </div>
    </React.Fragment>
  )
}

export default NoteCTAs
