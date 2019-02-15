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

async function main() {
  // const json = await request.get('/', {
  //   qs: {
  //     to: 'AKL',
  //     from: 'ARN',
  //     outDate: '20190808'
  //   }
  // })

  const data = require('./data')

  const tmp = Object.entries(data.outboundFlights)
    .map(([_, v]) => v)
    .filter(offer => offer.cabins.BUSINESS)
    .map(offer => offer.segments.map(s => `${s.departureAirport.name} - ${s.arrivalAirport.name}`))

  console.log(tmp)
}

main()
