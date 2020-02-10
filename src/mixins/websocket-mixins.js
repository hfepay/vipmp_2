import WebSocketCls from '../utils/websocket'
export const WebsocketMixins = {
  data() {
    return {
      _websocket: null,
      websocketUrl: null,
      websocketMsgScheduled: null,
      interval: 30 * 1000,
      retryCount: 0, // 重试计数
      maxRetry: 3 // 最大重连次数
    }
  },
  created() {
    this.validatekWebSocketEnvironment() && this._initWebSocket()
  },
  beforeDestroy() {
    this._closeWebSocket()
  },
  watch: {
    websocketUrl: function(newVal) {
      if (newVal) {
        this._initWebSocket()
      } else {
        this._closeWebSocket()
      }
    }
  },
  methods: {
    validatekWebSocketEnvironment() {
      return true
    },
    _initWebSocket() {
      this._closeWebSocket()
      this.websocketMsgScheduled && clearInterval(this.websocketMsgScheduled)
      if (this.websocketUrl) {
        this._websocket = this._getWebSocket()
        this.websocketMsgScheduled = setInterval(_ => this.websocketsend(''), this.interval)
      }
    },
    _getWebSocket() {
      return new WebSocketCls({
        url: this.websocketUrl,
        onmessage: this._websocketonmessage,
        onopen: this._websocketonopen,
        onerror: this._websocketonerror,
        onclose: this._websocketclose
      })
    },
    _websocketonmessage(e) {
      console.log(`${e.currentTarget.url}返回数据:`, e.data)
      const data = JSON.parse(e.data).data
      this.websocketonmessageCallBack(data)
    },
    websocketonmessageCallBack(data) {},
    _websocketonopen() {
      console.log(`连接建立成功${this.websocketUrl}`)
      this.websocketonopenCallBack()
    },
    websocketonopenCallBack() {},
    _websocketonerror() {
      this._websocket && this._websocket.close()
      this.websocketonerrorCallBack()
      if (this.retryCount < this.maxRetry) {
        this.retryCount++
        setTimeout(_ => this._initWebSocket(), this.interval)
      }
    },
    websocketsend(data) { // 数据发送
      console.log('发送数据:', data)
      this._websocket && this._websocket.send(data)
    },
    websocketonerrorCallBack() {},
    _websocketclose() {
      this._websocket = null
      console.log(`断开连接${this.websocketUrl}`)
    },
    _closeWebSocket() {
      this._websocket && this._websocket.close && this._websocket.close()
    }
  }
}
