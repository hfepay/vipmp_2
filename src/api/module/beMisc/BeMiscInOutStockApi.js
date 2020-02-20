import BeMiscApi from './BeMiscApi'
class BeMiscInOutStockApi extends BeMiscApi {
  constructor() {
    super('inOutStock')
  }
}

export default new BeMiscInOutStockApi()
