require('dotenv').config()
const express = require('express')
const graphql = require('express-graphql')
const resolver = require('./api')
const schema = require('./schema')(resolver)

const app = express()
app.use('/graphql', graphql({ schema: schema, graphiql: true }))
app.listen(process.env.PORT || 3000)
