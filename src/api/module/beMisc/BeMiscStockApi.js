import BeMiscApi from './BeMiscApi'
import request from '@/utils/request'

class BeMiscStockApi extends BeMiscApi {
  constructor() {
    super('stock')
  }

  async getOptionsByType() { // 根据类型查找
    const res = await super.list()
    const data = res.data || []
    return data.map(item => {
      return { value: `${item.stockId}`, label: item.stockName }
    })
  }

  changeStock(data) { return request.post(`${this.BASEURL}/changeStock`, data) }
}

export default new BeMiscStockApi()
