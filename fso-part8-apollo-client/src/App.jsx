import { useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import { ALL_PERSONS } from './queries'

function App () {
  const { loading, data } = useQuery(ALL_PERSONS)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <PersonForm />
      <Persons persons={data.allPersons} />
    </>
  )
}

export default App
