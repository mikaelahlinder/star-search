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

module.exports = async ({ from, to, date: outDate, pax: adt }) => {
  return await request
    .get('/', {
      qs: {
        from,
        to,
        outDate,
        adt
      }
    })
    .then(res => (res.errors ? Promise.reject(res.errors) : Object.values(res.outboundFlights)))
    .catch(errors => {
      throw errors.map(e => e.errorMessage).join('\n')
    })
}
