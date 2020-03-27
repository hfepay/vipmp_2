import TradeApi from './TradeApi'
class TradeReceiveOrgApi extends TradeApi {
  constructor() {
    super('receiveOrg')
  }
}

export default new TradeReceiveOrgApi()
