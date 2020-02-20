import BeMiscApi from './BeMiscApi'
import request from '@/utils/request'
class BeMiscSendLogApi extends BeMiscApi {
  constructor() {
    super('sendLog')
  }

  showLogs(id) {
    return request.get(`${this.BASEURL}/logs/${id}`)
  }

  send(data) {
    return request.post(`${this.BASEURL}/send`, data)
  }
}

export default new BeMiscSendLogApi()
