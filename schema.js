const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql')
const api = require('./api')

const airport = new GraphQLObjectType({
  name: 'Airport',
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    haltDuration: { type: GraphQLString }
  }
})

const flight = new GraphQLObjectType({
  name: 'Flight',
  fields: {
    originCity: { type: airport },
    destinationCity: { type: airport },
    origin: { type: airport },
    destination: { type: airport },
    connectionDuration: { type: GraphQLString },
    startTimeInLocal: { type: GraphQLString },
    startTimeInGmt: { type: GraphQLString },
    endTimeInLocal: { type: GraphQLString },
    endTimeInGmt: { type: GraphQLString },
    stops: { type: GraphQLInt },
    via: { type: GraphQLList(airport) }
  }
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      flights: {
        type: GraphQLList(flight),
        args: {
          from: { type: GraphQLString },
          to: { type: GraphQLString },
          date: { type: GraphQLString },
          adt: { type: GraphQLInt, defaultValue: 1 },
          stops: { type: GraphQLInt, defaultValue: undefined }
        },
        resolve: async (context, { from, to, date, adt }) => {
          return await api(from, to, date, adt)
        }
      }
    }
  })
})
