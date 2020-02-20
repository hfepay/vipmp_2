import WebsocketApi from './WebsocketApi'
class WebsocketMessageApi extends WebsocketApi {
  constructor() {
    super('websocket')
  }
  list(data = {}) {
    data && delete data.page
    data && delete data.limit
    return super.customize_get(`/message/list`, data)
  }
}

export default new WebsocketMessageApi()
