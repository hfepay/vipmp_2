import WechatApi from './WechatApi'
import request from '@/utils/request'
class WechatCardTypeApi extends WechatApi {
  constructor() {
    super('cardType')
  }
  async getOptions() {
    const res = await super.list()
    return (res.data || []).map(item => {
      return {
        label: item.typeName,
        value: item.id
      }
    })
  }

  async getSupportList() {
    const res = await this.getSupport()
    return res.data
  }
  async getSupport(data) {
    data = data || {}
    delete data.page
    delete data.limit
    return request.get(`${this.BASEURL}/support`, { params: data })
  }
}

export default new WechatCardTypeApi()
