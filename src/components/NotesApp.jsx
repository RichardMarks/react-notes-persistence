import React, { useReducer, useEffect } from 'react'

import NotesContext from 'state/NotesContext'
import NotesActions from 'state/NotesActions'
import notesReducer from 'state/notesReducer'
import notesStorageService from 'state/notesStorageService'

import NoteCTAs from 'components/NoteCTAs'
import NotesList from 'components/NotesList'

const NotesApp = () => {
  const [ notes, dispatch ] = useReducer(notesReducer, [])

  useEffect(() => {
    notesStorageService.fetchNotes()
      .then(storedNotes => {
        console.log({ storedNotes })
        if (storedNotes.length) {
          dispatch({ type: NotesActions.LOAD_NOTES, notes: storedNotes })
        }
      }, err => {
        console.error(err)
      })
  }, [])

  useEffect(() => {
    if (notes.length) {
      notesStorageService.submitNotes(notes)
        .then(savedOk => {
          console.log({ savedOk, notes })
        }, err => {
          console.error(err)
        })
    }
  }, [ notes ])

  return (
    <React.Fragment>
      <NotesContext.Provider value={[notes, dispatch]}>
        <NoteCTAs />
        <NotesList />
      </NotesContext.Provider>
    </React.Fragment>
  )
}

export default NotesApp
