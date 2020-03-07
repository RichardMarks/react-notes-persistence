import React from 'react'

import { useNotesContext } from 'state/NotesContext'

import Note from 'components/Note'

const NotesList = () => {
  // eslint-disable-next-line no-unused-vars
  const [ notes, dispatch ] = useNotesContext()
  return (
    <ul>
      {notes.map(note => <Note key={note.id} {...note} />)}
    </ul>
  )
}

export default NotesList
