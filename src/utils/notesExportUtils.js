export const VERSION_COMPAT = '2.0.0'

const downloadBlob = ({ filename, dataFmt, mimeType }) => {
  const hasBlobSupport = typeof window.Blob === 'function'
  const hasURLSupport = window.URL && typeof window.URL.createObjectURL === 'function'
  const hasSupport = hasBlobSupport && hasURLSupport

  if (filename && dataFmt && mimeType && hasSupport) {
    const blob = new window.Blob([dataFmt], { type: mimeType })
    const href = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.download = filename
    anchor.href = href
    anchor.dataset.downloadurl = `${mimeType}:${filename}:${href}`
    anchor.dispatchEvent(new window.MouseEvent('click', {
      bubbles: true,
      cancelable: false,
      view: window
    }))
  } else {
    window.alert('well this really sucks. You are not able to export your notes from this device :(')
  }
}

const notesExportUtils = {
  exportAsBinary (notes, filename) {
    /*
    #define SIGNATURE 0x4e303733 // N073
    #define VERSION_PREFIX 0x76 // v
    struct header_t {
      unsigned int signature;
      unsigned int version; // bytes: prefix, major, minor, patch
      double timestamp;
      unsigned int note_count;
    };
    struct note_t {
      unsigned char id_length;
      unsigned char subject_length;
      unsigned int body_length;
      unsigned char* id;
      unsigned char* subject;
      unsigned char* body;
    };
    struct data_t {
      struct note_t* notes;
    };
    */
    const SIGNATURE = 0x4e303733 // N073
    const VERSION_PREFIX = 0x76 // v
    const [ versionMajor, versionMinor, versionPatch ] = VERSION_COMPAT.split('.').map(x => +x)

    const signatureSize = 4
    const versionSize = 4
    const timestampSize = 8
    const noteCountSize = 4

    const notesSize = notes.reduce((t, n) => {
      const idSize = 2 * n.id.length
      const subjectSize = 2 * n.subject.length
      const bodySize = 2 * n.body.length
      return t + (idSize + subjectSize + bodySize)
    }, notes.length * 6)

    const headerSize = signatureSize + versionSize + timestampSize + noteCountSize
    const dataSize = notesSize

    const buffer = new ArrayBuffer(headerSize + dataSize)
    const view = new DataView(buffer)
    let offset = 0

    // header.signature
    view.setUint32(offset, SIGNATURE)
    offset += signatureSize

    // header.version
    view.setUint8(offset, VERSION_PREFIX)
    view.setUint8(offset + 1, versionMajor)
    view.setUint8(offset + 2, versionMinor)
    view.setUint8(offset + 3, versionPatch)
    offset += versionSize

    // header.timestamp
    const timestamp = (new Date()).getTime()
    view.setFloat64(offset, timestamp)
    offset += timestampSize

    // header.note_count
    view.setUint32(offset, notes.length)
    offset += noteCountSize

    // data.notes
    for (let i = 0; i < notes.length; i += 1) {
      const n = notes[i]
      view.setUint8(offset, n.id.length)
      view.setUint8(offset + 1, n.subject.length)
      view.setUint32(offset + 2, n.body.length)
      offset += 6
      n.id.split('').map(c => c.charCodeAt(0)).forEach(byte => {
        view.setUint8(offset, byte)
        offset += 1
      })
      n.subject.split('').map(c => c.charCodeAt(0)).forEach(byte => {
        view.setUint8(offset, byte)
        offset += 1
      })
      n.body.split('').map(c => c.charCodeAt(0)).forEach(byte => {
        view.setUint8(offset, byte)
        offset += 1
      })
    }

    const dataFmt = buffer
    downloadBlob({ filename, dataFmt, mimeType: 'application/octet-stream' })
  },

  exportAsXML (notes, filename) {
    // <?xml version="1.0" encoding="utf-8"?>
    // <notes version="2.0.0" exportedAt="timestamp_long_integer">
    //   <note id="uuid-v4" subject="subject_string">body_string</note>
    //   <note id="uuid-v4" subject="subject_string">body_string</note>
    //   <note id="uuid-v4" subject="subject_string">body_string</note>
    // </notes>
    const timestamp = (new Date()).getTime()
    const notesOpenTag = `<notes version="${VERSION_COMPAT}" exportedAt="${timestamp}">`
    const notesCloseTag = '</notes>'
    const notesTags = notes.map(note => `<note id="${note.id}" subject="${note.subject}">${note.body}</note>`)
    const xmlOpen = '<?xml version="1.0" encoding="utf-8"?>'
    const dataFmt = `${xmlOpen}\n${notesOpenTag}\n${notesTags.join('\n')}\n${notesCloseTag}`
    downloadBlob({ filename, dataFmt, mimeType: 'application/xml' })
  },

  exportAsJSON (notes, filename) {
    const data = {
      version: VERSION_COMPAT,
      exportedAt: (new Date()).getTime(),
      notes
    }
    const dataFmt = typeof data === 'object'
      ? JSON.stringify(data, undefined, 2)
      : data
    downloadBlob({ filename, dataFmt, mimeType: 'text/json' })
  }
}

export default notesExportUtils
