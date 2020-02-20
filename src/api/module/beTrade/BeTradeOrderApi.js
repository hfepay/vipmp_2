import BeTradeApi from './BeTradeApi'
import request from '@/utils/request'
class BeTradeOrderApi extends BeTradeApi {
  constructor() {
    super('order')
  }
  cancel(id) {
    return request.delete(`${this.BASEURL}/bye/${id}`)
  }
  hisoryPage(data) {
    return request.get(`${this.BASEURL}/hisoryPage`, { params: data })
  }
  getAmount(data) {
    return request.get(`${this.BASEURL}/getAmount`, { params: data })
  }
  boardingPassNum(data) {
    return super.customize_post('/boardingPassNum', data)
  }
  exportHistoryExcel(data) {
    return super.customize_export(`/hisoryPage/export`, data)
  }
}

export default new BeTradeOrderApi()
