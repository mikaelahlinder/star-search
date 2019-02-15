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

module.exports = async ({ from, to, date: outDate, adt = 1 }) => {
  return await request
    .get('/', {
      qs: {
        from,
        to,
        outDate,
        adt
      }
    })
    .then(({ outboundFlights = {} }) => Object.values(outboundFlights))
}
