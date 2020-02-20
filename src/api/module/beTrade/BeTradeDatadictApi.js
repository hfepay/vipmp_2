import BeTradeApi from '../beTrade/BeTradeApi'
import request from '@/utils/request'
class BeTradeDatadictApi extends BeTradeApi {
  constructor() {
    super('datadict')
  }

  async getOptionsByType(type, params = {}) { // 根据类型查找
    const res = await super.list({ dictType: type, ...params })
    return super.toOptions(res.data, { label: 'dictName' })
  }
  async getOptionsNameByType(type) {
    const data = await this.getOptionsByType(type)
    return  super.toOptions(data, { label:'label',value : 'label' })
  }
  async getOptionsByTypeWithoutBJD(type) { // 根据类型查找
    const res = await this.getOptionsByType(type, { 'bjd': 1 })
    return res
  }

  async lcList() { // 获取两舱列表，接待登记的客户类型下拉框
    const res = await request.get(`${this.BASEURL}/lcList`)
    return super.toOptions(res.data, { label: 'dictName' })
  }
  /* 测试不返回数据接口*/
  getWeb(data) {
    return super.customize_get('/getWeb', data)
  }
}

export default new BeTradeDatadictApi()
