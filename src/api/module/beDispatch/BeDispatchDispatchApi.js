import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchDispatchApi extends BeDispatchApi {
  constructor() {
    super('dispatch')
  }
  dispatchInit(data) {
    return request.get(`${this.BASEURL}/dispatchInit`, { params: data })
  }
  addTask(data) {
    return request.post(`${this.BASEURL}/task/add`, data)
  }
  findByFlightNumber(data) {
    return request.get(`${this.BASEURL}/findByFlightNumber`, { params: data })
  }
  flightStat(data) {
    return request.get(`${this.BASEURL}/flightStat`, { params: data })
  }
  hallStatus(id) {
    return request.get(`${this.BASEURL}/hallStatus/${id}`)
  }
}

export default new BeDispatchDispatchApi()
