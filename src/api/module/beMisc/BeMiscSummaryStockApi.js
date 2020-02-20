import BeMiscApi from './BeMiscApi'
import request from '@/utils/request'
class BeMiscSummaryStockApi extends BeMiscApi {
  constructor() {
    super('SummaryStock')
  }
  totalReport(data) {
    return request.get(`${this.BASEURL}/totalReport`, { params: data })
  }
}

export default new BeMiscSummaryStockApi()
