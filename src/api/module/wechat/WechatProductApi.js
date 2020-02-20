import WechatApi from './WechatApi'
class WechatProductTypeApi extends WechatApi {
  constructor(entity) {
    super('product', entity)
  }
  up(id) {
    return super.customize_get(`/up/${id}`)
  }
  down(id) {
    return super.customize_get(`/down/${id}`)
  }
  async getOptions() {
    const res = await super.list()
    return super.toOptions(res.data, { label: 'productName' })
  }
}

export default new WechatProductTypeApi()

