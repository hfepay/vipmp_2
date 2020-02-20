import BeTradeApi from './BeTradeApi'
class BeTradeAirlineHqApi extends BeTradeApi {
  constructor() {
    super('airlineHq')
  }
  findByCode(code) {
    return super.customize_get(`/findByCode/${code}`)
  }
  async getOptionsByCode(code) {
    const res = await this.findByCode(code)
    return res.data.map(item => {
      return {
        label: item,
        value: item
      }
    })
  }
}

export default new BeTradeAirlineHqApi()
