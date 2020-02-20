import BeTradeApi from './BeTradeApi'
class BeTradeFlightRecordApi extends BeTradeApi {
  constructor() {
    super('flightRecord')
  }
}

export default new BeTradeFlightRecordApi()
