/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import {Input ,Button} from '../styles' 


const Login = props => {
  const navigate = useNavigate()

  const onSubmit = event => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          Username:
          <Input />
        </div>
        <div>
          Password:
          <Input type='password' />
        </div>
        <div>
          <Button primary='' type='submit'>
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
