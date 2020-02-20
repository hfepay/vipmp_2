import BeTradeApi from '../beTrade/BeTradeApi'
class BeTradeSettlementApi extends BeTradeApi {
  constructor() {
    super('settlement')
  }

  async getOptions(datadictId) {
    const res = await super.list(datadictId ? { datadictId: datadictId } : {})
    return super.toOptions(res.data, { label: 'selType' })
  }
  async getOptionsAll(datadictId) {
    const res = await super.list(datadictId ? { datadictId: datadictId } : {})
    return res
  }
}

export default new BeTradeSettlementApi()
