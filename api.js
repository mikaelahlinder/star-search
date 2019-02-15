const fs = require('fs')
const request = require('request-promise-native').defaults({
  json: true,
  baseUrl: 'https://api.flysas.com/offers/flights',
  qs: {
    adt: 1,
    chd: 0,
    inf: 0,
    yth: 0,
    bookingFlow: 'star',
    pos: 'se',
    channel: 'web',
    displayType: 'upsell'
  }
})

module.exports = async (from, to, outDate, adt = 1) => {
  return require('./data')
  return await request
    .get('/', {
      qs: {
        from,
        to,
        outDate,
        adt
      }
    })
    .then(({ outboundFlights = {} }) => {
      const flights = Object.values(outboundFlights)
      if (process.env.ENV === 'dev') fs.writeFileSync('data.json', JSON.stringify(flights))
      return flights
    })
}
