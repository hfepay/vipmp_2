import WechatApi from './WechatApi'
class WechatProductOrderApi extends WechatApi {
  constructor() {
    super('productOrder')
  }
  get(id) {
    return super.customize_get(`/ht/${id}`)
  }
  pay(data) {
    return super.customize_post(`/pay`, data)
  }
  cancel(id) {
    return super.customize_post(`/cancel/${id}`)
  }
  jump(id) {
    return super.customize_get(`/jump/${id}`)
  }
  async getOptions() {
    const res = await super.list()
    return super.toOptions(res.data, { label: 'name' })
  }
}

export default new WechatProductOrderApi()
