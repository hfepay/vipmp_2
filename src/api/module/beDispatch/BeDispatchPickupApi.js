import BeDispatchApi from './BeDispatchApi'
class BeDispatchPickupApi extends BeDispatchApi {
  constructor() {
    super('pickup')
  }
}

export default new BeDispatchPickupApi()
