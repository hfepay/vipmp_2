import BeTradeApi from '../beTrade/BeTradeApi'
import request from '@/utils/request'
class BeTradeReceiveOrgApi extends BeTradeApi {
  constructor() {
    super('receiveOrg')
  }
  async getOptions(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'name' })
  }
  // 商旅客户 传1；  航司客户 传2
  async getBusinessTravelOptions() {
    return await this.getOptions({ datadictId: 1 })
  }
  async getflightCompanyOptions() {
    return await this.getOptions({ datadictId: 2 })
  }
  async reportOrgOptions(data) {
    const res = await this.reportOrgList(data)
    return super.toOptions(res.data, { label: 'name' })
  }
  async reportOrgList(data) {
    return await super.customize_get('/reportOrgList', data)
  }
  async CompanyList() { // 获取接待单位下拉框
    const res = await request.get(`${this.BASEURL}/list`)

    return super.toOptions(res.data, { label: 'name' })
  }
  async getOptionsName(data) {
    const res = await this.getOptions(data)
    return res.map(item => {
      return {
        value: item.label
      }
    })
  }
}

export default new BeTradeReceiveOrgApi()
