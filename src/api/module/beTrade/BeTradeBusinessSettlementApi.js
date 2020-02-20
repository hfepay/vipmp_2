import BeTradeApi from './BeTradeApi'
class BeTradeBusinessSettlementApi extends BeTradeApi {
  constructor() {
    super('businessSettlement')
  }
}

export default new BeTradeBusinessSettlementApi()
