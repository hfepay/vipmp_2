import BeMiscApi from './BeMiscApi'
import request from '@/utils/request'
class BeMiscAssetApi extends BeMiscApi {
  constructor() {
    super('asset')
  }

  waste(id) {
    return request.get(`${this.BASEURL}/waste/${id}`)
  }
}

export default new BeMiscAssetApi()
