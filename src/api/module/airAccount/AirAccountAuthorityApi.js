import AirAccountApi from './AirAccountApi'
class AirAccountAuthorityApi extends AirAccountApi {
  constructor() {
    super('authority')
  }
}

export default new AirAccountAuthorityApi()
