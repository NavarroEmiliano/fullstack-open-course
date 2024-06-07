import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import FormInput from './FormInput'

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const PersonForm = () => {
  const [name, setName] = useState()
  const [phone, setPhone] = useState()
  const [street, setStreet] = useState()
  const [city, setCity] = useState()

  const [createPerson] = useMutation(CREATE_PERSON)

  const submit = e => {
    e.preventDefault()

    createPerson({ variables: { name, phone, street, city } })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={submit}>
        <FormInput label='Name' value={name} setValue={setName} />
        <FormInput label='Phone' value={phone} setValue={setPhone} />
        <FormInput label='Street' value={street} setValue={setStreet} />
        <FormInput label='City' value={city} setValue={setCity} />
        <button type='submit'>Add!</button>
      </form>
    </div>
  )
}

export default PersonForm
