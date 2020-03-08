const notesExportUtils = {
  exportAsJSON (notes) {
    const filename = `notes_${(new Date()).getTime()}.json`
    const data = {
      exportedAt: (new Date()).getTime(),
      notes
    }
    const hasBlobSupport = typeof window.Blob === 'function'
    const hasURLSupport = window.URL && typeof window.URL.createObjectURL === 'function'
    const hasSupport = hasBlobSupport && hasURLSupport

    if (filename && data && hasSupport) {
      const dataFmt = typeof data === 'object'
        ? JSON.stringify(data, undefined, 2)
        : data

      const blob = new window.Blob([dataFmt], { type: 'text/json' })
      const href = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.download = filename
      anchor.href = href
      anchor.dataset.downloadurl = `text/json:${filename}:${href}`
      anchor.dispatchEvent(new window.MouseEvent('click', {
        bubbles: true,
        cancelable: false,
        view: window
      }))
    } else {
      window.alert('well this really sucks. You are not able to export your notes from this device :(')
    }
  }
}

export default notesExportUtils
