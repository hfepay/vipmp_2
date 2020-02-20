import BeTradeApi from './BeTradeApi'
class BeTradeAirlineSettlementApi extends BeTradeApi {
  constructor() {
    super('airlineSettlement')
  }
}

export default new BeTradeAirlineSettlementApi()
