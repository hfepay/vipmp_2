import WechatApi from './WechatApi'
import request from '@/utils/request'
class WechatArticleContentApi extends WechatApi {
  constructor() {
    super('articleContent')
  }
  // 上架
  deploy(id) {
    return request.get(`${this.BASEURL}/up/${id}`)
  }
  // 下架
  inactive(id) {
    return request.get(`${this.BASEURL}/down/${id}`)
  }
}

export default new WechatArticleContentApi()
