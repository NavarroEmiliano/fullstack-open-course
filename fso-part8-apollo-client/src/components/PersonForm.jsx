import { useMutation } from '@apollo/client'
import { useState } from 'react'
import FormInput from './FormInput'
import { CREATE_PERSON, ALL_PERSONS } from '../queries'

const PersonForm = ({ setError }) => {
  const [name, setName] = useState()
  const [phone, setPhone] = useState()
  const [street, setStreet] = useState()
  const [city, setCity] = useState()

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: error => {
      const message = error.graphQLErrors[0].message
      setError(message)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson)
        }
      })
    }
  })

  const submit = e => {
    e.preventDefault()

    createPerson({
      variables: { name, phone: phone || undefined, street, city }
    })

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
