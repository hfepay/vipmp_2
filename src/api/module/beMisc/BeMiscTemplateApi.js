import BeMiscApi from './BeMiscApi'
class BeMiscTemplateApi extends BeMiscApi {
  constructor() {
    super('template')
  }

  async getOptions() {
    const res = await super.list()
    return (res.data || []).map(item => {
      return {
        label: item.title,
        content: item.content,
        value: item.id
      }
    })
  }
}

export default new BeMiscTemplateApi()
