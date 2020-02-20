import SocketApi from './SocketApi'
class SocketWebsocketApi extends SocketApi {
  constructor() {
    super('websocket')
  }
  confirm(data) { return super.customize_post('/confirm', data) }
  close(data) { return super.customize_post('/close', data) }
  edit(data) { return super.customize_post('/edit', data) }
}

export default new SocketWebsocketApi()
