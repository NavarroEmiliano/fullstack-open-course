import Person from './Person'

const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p => (
        <Person key={p.id} person={p} />
      ))}
    </div>
  )
}

export default Persons
