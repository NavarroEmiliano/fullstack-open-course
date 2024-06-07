const Person = ({ person, showPerson }) => {
  return (
    <div>
      {person.name} {person.phone}
      <button onClick={() => showPerson(person.name)}>Show Address</button>
    </div>
  )
}

export default Person
