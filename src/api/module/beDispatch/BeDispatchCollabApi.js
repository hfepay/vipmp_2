import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchCollabApi extends BeDispatchApi {
  constructor() {
    super('collab')
  }
  serve(data) {
    return request.post(`${this.module}/serve`, data)
  }
  leave(data) {
    return request.post(`${this.BASEURL}/leave`, data)
  }
  notify(data) {
    return request.post(`${this.BASEURL}/notify`, data)
  }
}

export default new BeDispatchCollabApi()
