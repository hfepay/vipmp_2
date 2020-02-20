import BeAccountApi from './BeAccountApi'
class BeAccountUserApi extends BeAccountApi {
  constructor() {
    super('user')
  }
}

export default new BeAccountUserApi()
