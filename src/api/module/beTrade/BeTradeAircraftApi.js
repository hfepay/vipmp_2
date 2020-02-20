import BeTradeApi from './BeTradeApi'
class BeTradeAircraftApi extends BeTradeApi {
  constructor() {
    super('aircraft')
  }
  getCompanysByTwoCode(code) {
    return super.customize_get(`/airlineCode/${code}`)
  }
  async getCompanysOptions(code) {
    const res = await this.getCompanysByTwoCode(code)
    return super.toOptions(res.data, { label: 'airline', value: 'airCode' })
  }
  async getOptions() {
    const res = await super.list()
    return super.toOptions(res.data, { label: 'airline', value: 'airline' })
  }
  async companyListOptions(data) {
    const res = await this.companyList(data)
    return super.toOptions(res.data, { label: 'airline', value: 'airline' })
  }
  companyList(data) {
    return super.customize_get('/companyList', data)
  }
  async getOptionsId() {
    const res = await super.list()
    return super.toOptions(res.data, { label: 'airline' })
  }
  async airlineList(data) {
    return super.customize_get(`/airlineList`, data)
  }
  async airlineListOptions(data) {
    const res = await this.airlineList(data)
    return super.toOptions(res.data, { label: 'airline', value: 'airline' })
  }
  // 通过机号获取航司的接口
  async getFlightCompanyByAirlineCode(airlineCode) {
    return super.customize_get(`/${airlineCode}`)
  }
}

export default new BeTradeAircraftApi()
