import { useEffect, useState } from 'react'
import noteService from '../services/notes'

export const useNotes = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await noteService.getAll()
        setNotes(response)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const addNote = async noteObject => {
    /*     noteFormRef.current.toggleVisibility() */
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
  }

  const toggleImportanceOf = async id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    const returnedNote = await noteService
      .update(id, changedNote)
    setNotes(notes.map(note_1 => (note_1.id !== id ? note_1 : returnedNote)))

  }

  return { notes, addNote,toggleImportanceOf }
}
