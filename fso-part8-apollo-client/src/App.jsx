import { useApolloClient, useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import { ALL_PERSONS } from './queries'
import { useState } from 'react'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const { loading, data } = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  if (loading) {
    return <div>Loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>Logout</button>
      <Persons persons={data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </>
  )
}

export default App
