import { useEffect, useState } from 'react'
import Person from './Person'
import { useLazyQuery } from '@apollo/client'
import { FIND_PERSON } from '../queries'

const Persons = ({ persons }) => {
  const [getPerson, result] = useLazyQuery(FIND_PERSON)
  const [person, setPerson] = useState(null)

  const showPerson = name => {
    getPerson({ variables: { nameToSearch: name } })
  }

  useEffect(() => {
    if (result.data) {
      setPerson(result.data.findPerson)
    }
  }, [result])

  if (person) {
    return (
      <div>
        <h2>{person.name}</h2>
        <div>
          {person.address.street} {person.address.city}
        </div>
        <div>{person.phone}</div>
        <button onClick={() => setPerson(null)}>Close</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {result.loading && <div>⏳</div>}

      {persons.map(p => (
        <Person key={p.id} person={p} showPerson={showPerson} />
      ))}
    </div>
  )
}

export default Persons
