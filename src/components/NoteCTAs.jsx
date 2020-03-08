import React, { useState } from 'react'

import { useNotesContext } from 'state/NotesContext'
import NotesActions from 'state/NotesActions'

import ExportNotesForm from 'components/ExportNotesForm'

const NoteCTAs = () => {
  const [ notes, dispatch ] = useNotesContext()
  const [ isExportFormVisible, setExportFormVisible ] = useState(false)

  const createNote = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    dispatch({ type: NotesActions.CREATE_NOTE })
  }

  const showExportForm = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    setExportFormVisible(true)
  }

  const hideExportForm = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    setExportFormVisible(false)
  }

  const onCancelExportForm = () => {
    hideExportForm()
  }

  const onSubmitExportForm = res => {
    const { format, filename } = res
    dispatch({ type: NotesActions.EXPORT_NOTES, filename, format })
    hideExportForm()
  }

  return (
    <React.Fragment>
      <div>
        <button onClick={createNote}>New Note</button>
        <button disabled={!notes.length || isExportFormVisible} style={{ marginLeft: 10 }} onClick={showExportForm}>Export Notes</button>
      </div>
      <ExportNotesForm
        show={isExportFormVisible}
        onSubmit={onSubmitExportForm}
        onCancel={onCancelExportForm}
      />
    </React.Fragment>
  )
}

export default NoteCTAs
