import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchOverallApi extends BeDispatchApi {
  constructor() {
    super('overall')
  }
  init(id) {
    return request.get(`${this.BASEURL}/init/${id}`)
  }
  getOverall(id) {
    return request.get(`${this.BASEURL}/${id}`)
  }
}

export default new BeDispatchOverallApi()
