/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react'
import './App.css'
import Note from './components/note/Note'
import Notification from './components/notification/Notification'
import Footer from './components/footer/Footer'
import LoginForm from './components/loginForm/LoginForm'
import Togglable from './components/togglable/Togglable'
import NoteForm from './components/noteForm/NoteForm'
import { useUser } from './hooks/useUser'
import { useNotes } from './hooks/useNotes'

const App = () => {
  const [showAll, setshowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { user, login } = useUser()
  const { notes, addNote, toggleImportanceOf, setNotes } = useNotes()

  const noteFormRef = useRef()

  const toggleImportanceOfNote = id => {
    toggleImportanceOf(id).catch(error => {
      setErrorMessage('the note was already deleted from server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const handleLogin = async credentials => {
    login(credentials).catch(exception => {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null ? (
        <Togglable buttonLabel='Login'>
          <LoginForm login={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <Togglable buttonLabel='New note' ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}

      <div>
        <button onClick={() => setshowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOfNote(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}

export default App
