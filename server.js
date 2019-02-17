require('dotenv').config()
const express = require('express')
const graphql = require('express-graphql')
const schema = require('./schema')
const api = require('./api')
const data = require('./data')

const app = express()
app.use(
  '/graphql',
  graphql({
    schema: schema,
    graphiql: true,
    formatError: e => e.message,
    context: {
      resolver: process.env.ENV === 'dev' ? () => data : api
    }
  })
)
app.listen(process.env.PORT || 3000)
