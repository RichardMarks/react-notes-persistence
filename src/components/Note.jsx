import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useNotesContext } from 'state/NotesContext'
import NotesActions from 'state/NotesActions'

const Note = note => {
  const [ isEdit, setEdit ] = useState(false)
  const [ subject, setSubject ] = useState(note.subject)
  const [ body, setBody ] = useState(note.body)
  const [ notes, dispatch ] = useNotesContext()

  const cancelChanges = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    if (note.subject !== subject || note.body !== body) {
      if (window.confirm('You have unsaved changes. Do you want to discard them?')) {
        setSubject(note.subject)
        setBody(note.body)
        setEdit(false)
      }
    }
  }

  const saveChanges = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    const changes = {}
    if (subject !== notes.subject) {
      changes.subject = subject
    }
    if (body !== notes.body) {
      changes.body = body
    }
    dispatch({ type: NotesActions.UPDATE_NOTE, id: note.id, changes })
    setEdit(false)
  }

  const removeNote = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    if (window.confirm(`Really remove note "${note.subject}"?`)) {
      dispatch({ type: NotesActions.REMOVE_NOTE, id: note.id })
    }
  }

  const beginEdit = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    setEdit(true)
  }

  const onSubjectChange = e => {
    setSubject(e.target.value)
  }

  const onBodyChange = e => {
    setBody(e.target.value)
  }

  return isEdit ? (
    <li style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginBottom: 10 }}>
      <div>Id: {note.id}</div>
      <div>Subject: <input value={subject} onChange={onSubjectChange} /></div>
      <textarea onChange={onBodyChange} value={body}>{body}</textarea>
      <button onClick={cancelChanges}>Cancel</button>
      <button onClick={saveChanges}>Save Changes</button>
    </li>
  ) : (
    <li style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginBottom: 10 }}>
      <div>Id: {note.id}</div>
      <div onDoubleClick={beginEdit}>Subject: {note.subject}</div>
      <pre onDoubleClick={beginEdit}>{note.body}</pre>
      <button onClick={removeNote}>Remove</button>
    </li>
  )
}

Note.propTypes = {
  id: PropTypes.string,
  subject: PropTypes.string,
  body: PropTypes.string
}

export default Note
