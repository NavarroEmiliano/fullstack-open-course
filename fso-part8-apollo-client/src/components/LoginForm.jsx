import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import FormInput from './FormInput'
const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: error => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const submit = async e => {
    e.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <FormInput setValue={setUsername} value={username} label='Username' />
        <FormInput
          setValue={setPassword}
          value={password}
          label='Password'
          type='password'
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm
