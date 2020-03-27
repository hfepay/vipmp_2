import TradeApi from './TradeApi'
class TradeDispatchDeviceApi extends TradeApi {
  constructor() {
    super('dispatchDevice')
  }
}

export default new TradeDispatchDeviceApi()
