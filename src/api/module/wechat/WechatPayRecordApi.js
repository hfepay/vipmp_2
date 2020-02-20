import WechatApi from './WechatApi'
class WechatPayRecordApi extends WechatApi {
  constructor() {
    super('payRecord')
  }
}

export default new WechatPayRecordApi()
