import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
})

const query = gql`
  query {
    allPersons {
      name
      phone
    }
  }
`
const { data } = await client.query({ query })
console.log(data)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
