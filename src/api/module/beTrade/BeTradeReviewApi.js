import BeTradeApi from './BeTradeApi'
class BeTradeReviewApi extends BeTradeApi {
  constructor() {
    super('review')
  }
  firstPass(ids) { // 记录复核
    return super.customize_put(`/firstPass?ids=${ids}`)
  }
  secPass(ids) { // 财务复核
    return super.customize_put(`/secPass?ids=${ids}`)
  }
  reject(ids) {
    return super.customize_put(`/reject?ids=${ids}`)
  }
  reviewByParams(data) {
    return super.customize_put('/reviewByParams', data)
  }
  del(obj) {
    const { type, id, delReason } = obj
    return super.customize_del_formdata(`/${type}/${id}`, { delReason: delReason })
  }
}

export default new BeTradeReviewApi()
