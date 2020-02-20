import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchRecordApi extends BeDispatchApi {
  constructor() {
    super('record')
  }
  flight(date) {
    return request.get(`${this.BASEURL}/flight/${date}`)
  }
  overall(date) {
    return request.get(`${this.BASEURL}/overall/${date}`)
  }
  task(date) {
    return request.get(`${this.BASEURL}/task/${date}`)
  }
}

export default new BeDispatchRecordApi()
