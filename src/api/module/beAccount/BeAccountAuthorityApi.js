import BeAccountApi from './BeAccountApi'
class BeAccountAuthorityApi extends BeAccountApi {
  constructor() {
    super('authority')
  }
}

export default new BeAccountAuthorityApi()
