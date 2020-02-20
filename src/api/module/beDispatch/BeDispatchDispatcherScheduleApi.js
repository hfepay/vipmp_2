import BeDispatchApi from './BeDispatchApi'
import request from '@/utils/request'
class BeDispatchDispatcherScheduleApi extends BeDispatchApi {
  constructor() {
    super('dispatcherSchedule')
  }
  queryValidDispatcherSchedule(data) {
    return request.get(`${this.BASEURL}/queryValidDispatcherSchedule`, { params: data })
  }
  async getOptions(hallName) {
    const res = await this.queryValidDispatcherSchedule({ hallName: hallName })
    return super.toOptions(res.data, { label: 'name' })
  }
}

export default new BeDispatchDispatcherScheduleApi()
