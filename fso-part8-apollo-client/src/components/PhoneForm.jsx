import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_NUMBER } from '../queries'
import FormInput from './FormInput'

const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [changeNumber, result] = useMutation(EDIT_NUMBER)

  const submit = e => {
    e.preventDefault()

    changeNumber({ variables: { name, phone } })

    setName('')
    setPhone('')
  }

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('Person not found')
    }
  }, [result.data]) //eslint-disable-line

  return (
    <div>
      <h2>change number</h2>
      <form onSubmit={submit}>
        <FormInput setValue={setName} value={name} label='Name' />
        <FormInput setValue={setPhone} value={phone} label='Phone' />
        <button type='submit'>Change number</button>
      </form>
    </div>
  )
}

export default PhoneForm
