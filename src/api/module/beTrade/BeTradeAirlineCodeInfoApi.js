import BeTradeApi from './BeTradeApi'
class BeTradeAirlineCodeInfoApi extends BeTradeApi {
  constructor() {
    super('airlineCodeInfo')
  }
}

export default new BeTradeAirlineCodeInfoApi()
