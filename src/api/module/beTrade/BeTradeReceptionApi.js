import BeTradeApi from './BeTradeApi'
import request from '@/utils/request'
class BeTradeReceptionApi extends BeTradeApi {
  constructor() {
    super('reception')
  }
  leave(id) {
    return request.get(`${this.BASEURL}/leave/${id}`)
  }
  hall(data) {
    return request.get(`${this.BASEURL}/hall`, { params: data })
  }
  getAmount(data) {
    return request.get(`${this.BASEURL}/getAmount`, { params: data })
  }
  getPrintInfoById(ids) {
    return super.customize_get(`/printById?ids=${ids}`)
  }
  apiId(id) {
    return super.customize_get(`/api/${id}`)
  }
  boardingPassNum(data) {
    return super.customize_post('/boardingPassNum', data)
  }
  leaveRecord(id) {
    return super.customize_get(`/leaveRecord/${id}`)
  }
}

export default new BeTradeReceptionApi()
