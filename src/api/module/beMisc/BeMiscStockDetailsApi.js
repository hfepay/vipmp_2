import BeMiscApi from './BeMiscApi'
class BeMiscStockDetailsApi extends BeMiscApi {
  constructor() {
    super('stockDetails')
  }
}

export default new BeMiscStockDetailsApi()
