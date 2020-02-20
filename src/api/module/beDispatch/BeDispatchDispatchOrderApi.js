import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchDispatchOrderApi extends BeDispatchApi {
  constructor() {
    super('dispatchOrder')
  }
  cancel(id) {
    return request.put(`${this.BASEURL}/cancel/${id}`)
  }
}

export default new BeDispatchDispatchOrderApi()
