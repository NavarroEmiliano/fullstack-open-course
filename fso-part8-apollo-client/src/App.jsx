import { gql, useQuery } from '@apollo/client'
import Persons from './components/Persons'

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
      <Persons persons={data.allPersons} />
    </>
  )
}

export default App
