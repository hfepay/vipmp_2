import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchRuntimeApi extends BeDispatchApi {
  constructor() {
    super('runtime')
  }
  dashboard(data) {
    return request.get(`${this.BASEURL}/dashboard`, { params: data })
  }
  hall(id) {
    return request.get(`${this.BASEURL}/hall/${id}`)
  }
  flight(flightNo) {
    return request.get(`${this.BASEURL}/flight/${flightNo}`)
  }
  pickup(flightNo) {
    return request.get(`${this.BASEURL}/pickup/${flightNo}`)
  }
  etd(data) {
    return request.post(`${this.BASEURL}/flight/etd`, data)
  }
}

export default new BeDispatchRuntimeApi()
