import WechatApi from './WechatApi'
class WechatCardApi extends WechatApi {
  constructor() {
    super('card')
  }
  orderCardDetail(data) { // 获取订单卡详情
    return super.customize_post('/orderCardDetail', data)
  }
}

export default new WechatCardApi()
