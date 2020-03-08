import React, { useState } from 'react'

const ExportNotesForm = ({
  show,
  onSubmit,
  onCancel
}) => {
  const [ filename, setFilename ] = useState('mynotes')
  const [ format, setFormat ] = useState('json')

  const onFilenameChange = e => {
    let value = e.target.value || ''
    value = value
      .replace(/[/?<>\\:*|"]/g, '')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1f\x80-\x9f]/g, '')
      .replace(/^\.+$/, '')
      .replace(/\s/g, '_')
      .substr(0, 255)
    setFilename(value)
  }

  const onFormatChange = e => {
    setFormat(e.target.value)
  }

  const submitForm = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    typeof onSubmit === 'function' && onSubmit({
      filename: `${filename}.${format}`,
      format
    })
  }

  const cancelForm = e => {
    e && e.preventDefault()
    e && e.stopPropagation()
    typeof onCancel === 'function' && onCancel()
  }

  return show ? (
    <div style={{ marginTop: 10, backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 10 }}>
      <label>Export Notes to save them to your computer, share with others, import into other software, etc...</label>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <label style={{ minWidth: 60 }}>Filename:</label>
        <input style={{ marginLeft: 10, flex: 1, padding: 5, fontSize: 16, fontFamily: 'monospace' }} type='text' value={filename} onChange={onFilenameChange} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <label style={{ minWidth: 60 }}>Format:</label>
        <select value={format} onChange={onFormatChange}>
          <option value='json'>JSON (*.json) (recommended)</option>
          <option value='xml'>XML (*.xml)</option>
          <option value='bin'>Binary (*.bin)</option>
        </select>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={cancelForm}>Cancel</button>
        <button disabled={!filename.length} style={{ marginLeft: 10 }} onClick={submitForm}>Export</button>
      </div>
    </div>
  ) : null
}

export default ExportNotesForm
