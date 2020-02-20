import BeTradeApi from './BeTradeApi'
import request from '@/utils/request'
class BeTradeHallApi extends BeTradeApi {
  constructor() {
    super('hall')
  }
  async getOptionsByDatadictId(datadictId) {
    const res = await request.get(`${this.BASEURL}/list/${datadictId}`)
    return super.toOptions(res.data, { label: 'roomName' })
  }
  async getOptions(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'roomName' })
  }

  async cabinHallList() {
    const res = await request.get(`${this.BASEURL}/one/list`)
    return super.toOptions(res.data, { label: 'roomName' })
  }

  async otherHallList(data) {
    const res = await super.customize_get(`/other/list`, data)
    return super.toOptions(res.data, { label: 'roomName' })
  }

  async confPriceListOptions(data) {
    const res = await this.confPriceList(data)
    return super.toOptions(res.data, { label: 'roomName' })
  }

  confPriceList(data) {
    return super.customize_get('/confPriceList', data)
  }
}
export default new BeTradeHallApi()
