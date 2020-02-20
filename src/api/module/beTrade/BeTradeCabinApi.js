import BeTradeApi from './BeTradeApi'
import request from '@/utils/request'
class BeTradeCabinApi extends BeTradeApi {
  constructor() {
    super('cabin')
  }
  approval(ids) {
    return request.post(`${this.BASEURL}/approval`, { ids: ids })
  }
  complete(ids) {
    return request.post(`${this.BASEURL}/complete`, { ids: ids })
  }
  getVipNum(hallId) {
    return request.get(`${this.BASEURL}/vipCount/${hallId}`)
  }
  leave(id) {
    return request.get(`${this.BASEURL}/leave/${id}`)
  }
  getAmount(data) {
    return request.get(`${this.BASEURL}/getAmount`, { params: data })
  }
  getMostPeople(data) {
    return super.customize_get('/getMostNum', data)
  }
  getPrintInfoById(ids) {
    return super.customize_get(`/printById?ids=${ids}`)
  }
  boardingPassNum(data) {
    return super.customize_post('/boardingPassNum', data)
  }
  apiId(id) {
    return super.customize_get(`/api/${id}`)
  }
}

export default new BeTradeCabinApi()
