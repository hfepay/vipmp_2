import BeTradeApi from './BeTradeApi'
class BeTradeAirlineProjectApi extends BeTradeApi {
  constructor() {
    super('airlineProject')
  }
  async relationList(data) {
    return super.customize_get('/relationList', data)
  }
  async addRelation(data) {
    return super.customize_post('/addRelation', data)
  }
  async updateRelation(data) {
    return super.customize_put('/updateRelation', data)
  }
  async getRelation(id) {
    return super.customize_get(`/relation/${id}`)
  }
  delRelation(id) {
    return super.customize_del(`/relation/${id}`)
  }
  async getOptions(data) {
    const res = await super.list(data)
    return super.toOptions(res.data, { label: 'prjName' })
  }
}

export default new BeTradeAirlineProjectApi()
