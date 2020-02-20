import BeDispatchApi from './BeDispatchApi'
class BeDispatchFlightApi extends BeDispatchApi {
  constructor() {
    super('flight')
  }
}

export default new BeDispatchFlightApi()
