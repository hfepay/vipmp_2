import request from '@/utils/request'
import BeAccountApi from './BeAccountApi'
class BeAccountStatisApi extends BeAccountApi {
  constructor() {
    super('statis')
  }
  declaTotalTheday(data) { return request.get(`${this.BASEURL}/declaTotalTheday`, { params: data }) }
  userScatter(data) { return request.get(`${this.BASEURL}/userScatter`, { params: data }) }
  declareByDay(data) { return request.get(`${this.BASEURL}/declareByDay`, { params: data }) }
  bookingByDay(data) { return request.get(`${this.BASEURL}/bookingByDay`, { params: data }) }
  contraband(data) { return request.get(`${this.BASEURL}/contraband`, { params: data }) }
  bookingByHour(data) { return request.get(`${this.BASEURL}/bookingByHour`, { params: data }) }
}

export default new BeAccountStatisApi()
