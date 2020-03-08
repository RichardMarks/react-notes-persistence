import { v4 as uuid } from 'uuid'
import NotesActions from 'state/NotesActions'

import notesExportUtils from 'utils/notesExportUtils'

const notesReducer = (notes, action) => {
  switch (action.type) {
    case NotesActions.LOAD_NOTES:
      return action.notes
    case NotesActions.EXPORT_NOTES:
      switch (action.format) {
        case 'json':
          notesExportUtils.exportAsJSON(notes, action.filename)
          break
        case 'xml':
          notesExportUtils.exportAsXML(notes, action.filename)
          break
        case 'bin':
          notesExportUtils.exportAsBinary(notes, action.filename)
          break
        default:
          console.warn(`Unknown export format: ${action.format} - using JSON`)
          notesExportUtils.exportAsJSON(notes, action.filename)
          break
      }
      return notes
    case NotesActions.CREATE_NOTE:
      const note = {
        id: uuid(),
        subject: 'empty subject',
        body: 'write something here'
      }
      return [ note, ...notes ]
    case NotesActions.REMOVE_NOTE:
      return notes.filter(note => note.id !== action.id)
    case NotesActions.UPDATE_NOTE:
      return notes.map(note => {
        if (note.id === action.id) {
          return { ...note, ...action.changes }
        }
        return note
      })
    default:
      return notes
  }
}

export default notesReducer
