import WechatApi from './WechatApi'
import request from '@/utils/request'
class WechatProductTypeApi extends WechatApi {
  constructor(entity) {
    super('productType', entity)
  }
  saveAndUpper(data) {
    return request.post(`${this.BASEURL}/saveAndUpper`, data)
  }
  lower(id) {
    return request.put(`${this.BASEURL}/lower/${id}`)
  }
  upper(id) {
    return request.put(`${this.BASEURL}/upper/${id}`)
  }
  async getOptions() {
    const res = await super.list()
    return super.toOptions(res.data, { label: 'name' })
  }
}

export default new WechatProductTypeApi()

