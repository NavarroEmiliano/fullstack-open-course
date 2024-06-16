import { ApolloServer } from '@apollo/server'
import { GraphQLError } from 'graphql'
import Person from './models/person.js'
import User from './models/user.js'
import jwt from 'jsonwebtoken'
import express from 'express'
import './db/index.js'

import { createServer } from 'http'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

const PORT = 4000

const typeDefs = `
  type User {
  username:String!
  friends:[Person!]!
  id:ID!
  }

  type Token {
  value:String!
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    friendOf:[User!]!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone:YesNo): [Person!]!
    findPerson(name: String!): Person
    allUsers: [User!]!
    me:User
  }

  type Mutation {
    addPerson(
      name:String!
      phone:String
      street:String!
      city:String!
    ):Person
    editNumber(
      name:String!
      phone:String!
    ): Person
    createUser(username:String!
    ): User
    login(username: String!
    password:String!
    ):Token
    addAsFriend(
    name:String!
    ):User
  }

  type Subscription {
    personAdded:Person!
  }
`

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (_root, args) => {
      console.log('Person.find')
      if (!args.phone) {
        return Person.find({}).populate('friendOf')
      }
      return Person.find({ phone: { $exists: args.phone === 'YES' } }).populate(
        'friendOf'
      )
    },
    findPerson: async (_root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    },
    allUsers: async () => User.find({})
  },
  Person: {
    address: root => {
      return {
        street: () => root.street,
        city: () => root.city
      }
    }
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      pubsub.publish('PERSON_ADDED', { personAdded: person })
      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      return person
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })
      return user.save().catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      const isFriend = person =>
        currentUser.friends
          .map(f => f._id.toString())
          .includes(person._id.toString())

      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const person = await Person.findOne({ name: args.name })

      if (!person) return null

      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person)
      }

      await currentUser.save()

      return currentUser
    }
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(['PERSON_ADDED'])
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const wsServerCleanup = useServer({ schema }, wsServer)

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose()
          }
        }
      }
    }
  ]
})

await apolloServer.start()

const corsOptions = {
  origin: 'http://localhost:5173'
}

app.use(cors(corsOptions))

app.use(
  '/graphql',
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id).populate(
          'friends'
        )
        return { currentUser }
      }
    }
  })
)

httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`)
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
  )
})
