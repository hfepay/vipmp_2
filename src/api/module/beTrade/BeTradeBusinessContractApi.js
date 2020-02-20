import BeTradeApi from './BeTradeApi'
class BeTradeBusinessContractApi extends BeTradeApi {
  constructor() {
    super('businessContract')
  }
}

export default new BeTradeBusinessContractApi()
