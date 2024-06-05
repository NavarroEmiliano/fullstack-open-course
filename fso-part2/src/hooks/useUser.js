import { useEffect, useState } from 'react'

import noteService from '../services/notes'
import loginService from '../services/login'

export const useUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const login = async credentials => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
    noteService.setToken(user.token)
    setUser(user)
  }

  return {
    user,
    login
  }
}
