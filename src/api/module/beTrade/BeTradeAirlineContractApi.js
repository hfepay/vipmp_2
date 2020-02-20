import BeTradeApi from './BeTradeApi'
import request from '@/utils/request'
class BeTradeAirlineContractApi extends BeTradeApi {
  constructor() {
    super('airlineContract')
  }
  delay(data) {
    return request.put(`${this.BASEURL}/delay`, data)
  }
}

export default new BeTradeAirlineContractApi()
