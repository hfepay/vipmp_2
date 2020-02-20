import BeTradeApi from './BeTradeApi'
class BeTradeAirlineApi extends BeTradeApi {
  constructor() {
    super('airline')
  }
  async getOptions(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'name' })
  }
  async getOptionsThreeCode(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'airline', value: 'airCodeThree' })
  }
  async getOptionsCode(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'name', value: 'code' })
  }
}

export default new BeTradeAirlineApi()
