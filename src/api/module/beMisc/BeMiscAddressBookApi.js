import BeMiscApi from './BeMiscApi'
class BeMiscAddressBookApi extends BeMiscApi {
  constructor() {
    super('addressBook')
  }

  async getOptions() {
    const res = await super.list()
    return (res.data || []).map(item => {
      return {
        label: item.name,
        value: `${item.id}`,
        item
      }
    })
  }
}

export default new BeMiscAddressBookApi()
