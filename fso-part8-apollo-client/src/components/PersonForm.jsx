import { useMutation } from '@apollo/client'
import { useState } from 'react'
import FormInput from './FormInput'
import { CREATE_PERSON, ALL_PERSONS } from '../queries'

const PersonForm = () => {
  const [name, setName] = useState()
  const [phone, setPhone] = useState()
  const [street, setStreet] = useState()
  const [city, setCity] = useState()

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }]
  })

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
