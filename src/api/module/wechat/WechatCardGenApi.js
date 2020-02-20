import WechatApi from './WechatApi'
class WechatCardGenApi extends WechatApi {
  constructor() {
    super('cardGen')
  }
  async singleExport(id) {
    return super.customize_export(`/singleExport/${id}`)
  }
}

export default new WechatCardGenApi()
