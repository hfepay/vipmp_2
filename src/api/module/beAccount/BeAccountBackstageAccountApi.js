import request from '@/utils/request'
import BeAccountApi from './BeAccountApi'
class BeAccountBackstageAccountApi extends BeAccountApi {
  constructor() {
    super('userAccount')
  }
  updatePassword(data) {
    return request.put(`${this.BASEURL}/updatePassword`, data)
  }
  resetPassword(data) {
    return request.post(`${this.BASEURL}/resetPassword`, data)
  }
  /* getCurUser(token) {
    return request({
      url: `${this.BASEURL}/getCurUser`,
      method: 'get',
      params: { token }
    })
  }*/
}

export default new BeAccountBackstageAccountApi()
