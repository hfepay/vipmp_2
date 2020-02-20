import BeDispatchApi from './BeDispatchApi'
class BeDispatchDispatchDeviceApi extends BeDispatchApi {
  constructor() {
    super('dispatchDevice')
  }

  async getOptions(data) {
    const res = await super.list(data)
    const list = res.data || []
    return list.map(item => {
      return {
        value: item.id,
        label: item.name
      }
    })
  }
}

export default new BeDispatchDispatchDeviceApi()
