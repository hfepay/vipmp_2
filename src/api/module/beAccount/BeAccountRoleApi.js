import BeAccountApi from './BeAccountApi'
class BeAccountRoleApi extends BeAccountApi {
  constructor() {
    super('role')
  }
  async getOptions(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'roleName' })
  }
}

export default new BeAccountRoleApi()
