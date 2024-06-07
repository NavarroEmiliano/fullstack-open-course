import { gql, useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

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
