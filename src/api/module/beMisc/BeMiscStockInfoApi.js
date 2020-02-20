import BeMiscApi from './BeMiscApi'
import request from '@/utils/request'
class BeMiscStockInfoApi extends BeMiscApi {
  constructor() {
    super('stockInfo')
  }

  changeStock(data) { return request.post(`${this.BASEURL}/changeStock`, data) }
}

export default new BeMiscStockInfoApi()
