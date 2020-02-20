import BeMiscApi from './BeMiscApi'
class BeMiscManagerApi extends BeMiscApi {
  constructor() {
    super('manager')
  }

  async getOptionsByType() { // 根据类型查找
    const res = await super.list()
    const data = res.data || []
    return data.map(item => {
      return {
        value: `${item.id}`,
        label: `物资ID:${item.id} 物资名称:${item.materialName} 规格:${item.specifications} 单位:${item.units} 单价:${item.price} `
      }
    })
  }
}

export default new BeMiscManagerApi()
