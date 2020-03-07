import React from 'react'

const NotesContext = React.createContext()

export const useNotesContext = () => React.useContext(NotesContext)

export default NotesContext
