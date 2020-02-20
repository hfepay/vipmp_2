import WechatApi from './WechatApi'
class WechatChannelApi extends WechatApi {
  constructor() {
    super('channel')
  }
  async getOptions() {
    const res = await super.list()
    return (res.data || []).map(item => {
      return {
        label: item.channelName,
        value: item.id
      }
    })
  }
}

export default new WechatChannelApi()
