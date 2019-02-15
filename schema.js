const { GraphQLSchema, GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLInt } = require('graphql')

const carrier = new GraphQLObjectType({
  name: 'Carrier',
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString }
  }
})

const aircraft = new GraphQLObjectType({
  name: 'Aircraft',
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString }
  }
})

const city = new GraphQLObjectType({
  name: 'City',
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString }
  }
})

const airport = new GraphQLObjectType({
  name: 'Airport',
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    haltDuration: { type: GraphQLString }
  }
})

const segment = new GraphQLObjectType({
  name: 'Segment',
  fields: {
    arrivalTerminal: { type: GraphQLString },
    arrivalDateTimeInLocal: { type: GraphQLString },
    arrivalDateTimeInGmt: { type: GraphQLString },
    departureTerminal: { type: GraphQLString },
    departureDateTimeInLocal: { type: GraphQLString },
    departureDateTimeInGmt: { type: GraphQLString },
    departureAirport: { type: airport },
    arrivalAirport: { type: airport },
    departureCity: { type: city },
    arrivalCity: { type: city },
    airCraft: { type: aircraft },
    flightNumber: { type: GraphQLString },
    duration: { type: GraphQLString },
    marketingCarrier: { type: carrier },
    operatingCarrier: { type: carrier },
    onTimePerformance: { type: GraphQLInt },
    miles: { type: GraphQLInt },
    numberOfStops: { type: GraphQLInt }
  }
})

const fare = new GraphQLObjectType({
  name: 'Fare',
  fields: {
    segmentId: { type: GraphQLString },
    bookingClass: { type: GraphQLString },
    avlSeats: { type: GraphQLInt },
    cabinName: { type: GraphQLString }
  }
})

const cabin = new GraphQLObjectType({
  name: 'Cabin',
  fields: {
    productName: { type: GraphQLString },
    productCode: { type: GraphQLString },
    avlSeats: {
      type: GraphQLInt,
      resolve: ({ fares }) => {
        const seats = fares.map(({ avlSeats }) => avlSeats)
        return Math.min.apply(Math, seats)
      }
    },
    lowestFare: { type: GraphQLBoolean },
    fares: { type: GraphQLList(fare) }
  }
})

const flight = new GraphQLObjectType({
  name: 'Flight',
  fields: {
    originCity: { type: city },
    destinationCity: { type: city },
    origin: { type: airport },
    destination: { type: airport },
    connectionDuration: { type: GraphQLString },
    startTimeInLocal: { type: GraphQLString },
    startTimeInGmt: { type: GraphQLString },
    endTimeInLocal: { type: GraphQLString },
    endTimeInGmt: { type: GraphQLString },
    stops: { type: GraphQLInt },
    via: { type: GraphQLList(airport) },
    segments: { type: GraphQLList(segment) },
    cabins: {
      type: GraphQLList(cabin),
      resolve: ({ cabins }) => {
        const result = []
        if (cabins.ECONOMY) result.push(Object.values(cabins.ECONOMY.ECONOMY.products)[0])
        if (cabins.BUSINESS) result.push(Object.values(cabins.BUSINESS.BUSINESS.products)[0])
        return result
      }
    }
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
        resolve: async (config, args, context) => await context.resolver(args)
      }
    }
  })
})
