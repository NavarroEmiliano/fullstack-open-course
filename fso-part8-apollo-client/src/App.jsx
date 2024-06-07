import { useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import { ALL_PERSONS } from './queries'
import { useState } from 'react'
import Notify from './components/Notify'

function App () {
  const [errorMessage, setErrorMessage] = useState(null)

  const { loading, data } = useQuery(ALL_PERSONS)

  if (loading) {
    return <div>Loading...</div>
  }

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <Persons persons={data.allPersons} />
      <PersonForm setError={notify} />
    </>
  )
}

export default App
