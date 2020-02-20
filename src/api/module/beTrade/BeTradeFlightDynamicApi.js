import BeTradeApi from './BeTradeApi'
import request from '@/utils/request'
class BeTradeFlightDynamicApi extends BeTradeApi {
  constructor() {
    super('flightDynamic')
  }
  getFlightDynamic(data) {
    return request.get(`${this.BASEURL}/getFlightDynamic`, { params: data })
  }
}

export default new BeTradeFlightDynamicApi()
