import { useState } from 'react'
import { Link, Navigate, Route, Routes, useMatch } from 'react-router-dom'
import Note from './components/Note'
import Notes from './components/Notes'
import Users from './components/Users'
import Login from './components/Login'
import Home from './components/Home'
import { Alert } from '@mui/material'
import { Footer, Navigation, Page } from './styles'

const padding = {
  padding: '5px'
}

const App = () => {
  const [notes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const login = user => {
    setUser(user)
    setMessage(`Welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <Page>
      {message && <Alert severity='success'>{message}</Alert>}
      <Navigation>
        <Link style={padding} to='/'>
          Home
        </Link>
        <Link style={padding} to='/notes'>
          Notes
        </Link>

        <Link style={padding} to='/users'>
          Users
        </Link>

        {user ? (
          <em>{user} logged in</em>
        ) : (
          <Link style={padding} to='/login'>Login</Link>
        )}
      </Navigation>

      <Routes>
        <Route path='/notes/:id' element={<Note note={note} />} />
        <Route path='/notes' element={<Notes notes={notes} />} />
        <Route
          path='/users'
          element={user ? <Users /> : <Navigate replace to='/login' />}
        />
        <Route path='/login' element={<Login onLogin={login} />} />
        <Route path='/' element={<Home />} />
      </Routes>

      <Footer>
        <em>Note app, Department of Computer Science 2023</em>
      </Footer>
    </Page>
  )
}

export default App
