import WechatApi from './WechatApi'
class WechatCustomerApi extends WechatApi {
  constructor() {
    super('customer')
  }
}

export default new WechatCustomerApi()
