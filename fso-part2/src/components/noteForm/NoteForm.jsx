import { useState } from 'react'

/* eslint-disable react/prop-types */
const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleNoteChange = event => {
    setNewNote(event.target.value)
  }

  const addNote = event => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false
    })
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input id='input-note' value={newNote} onChange={handleNoteChange} />
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default NoteForm
