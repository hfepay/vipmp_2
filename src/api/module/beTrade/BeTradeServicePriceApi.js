import BeTradeApi from './BeTradeApi'
class BeTradeServicePriceApi extends BeTradeApi {
  constructor() {
    super('servicePrice')
  }
}

export default new BeTradeServicePriceApi()
