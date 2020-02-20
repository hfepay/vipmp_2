import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchTaskApi extends BeDispatchApi {
  constructor() {
    super('task')
  }
  todays() {
    return request.get(`${this.BASEURL}/todays`)
  }
  cancel(id) {
    return request.put(`${this.BASEURL}/cancel/${id}`)
  }
  init(id) {
    return request.get(`${this.BASEURL}/init/${id}`)
  }
}

export default new BeDispatchTaskApi()
