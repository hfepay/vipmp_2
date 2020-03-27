<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <el-date-picker
              v-model="queryParams.flight_date"
              value-format="yyyy-MM-dd"
              range-separator="至"
              placeholder="请选择时间"
              @change="search"
            />
          </el-form-item>
        </base-form>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beDispatch/BeDispatchOverallApi'
export default {
  name: 'PoliticalDignitary',
  mixins: [Mixins],
  data() {
    return {
      Headers: [
        { label: '序号', type: 'index' },
        { label: '作业编号', prop: 'id' },
        { label: '航班号', prop: 'flightNo' },
        { label: '预计起飞', prop: 'etd' },
        { label: '预计到场', prop: 'eta' },
        { label: '到场通报', prop: 'ata' },
        { label: '登机口', prop: 'boardingGate' },
        { label: '总人数', prop: 'headcount' },
        { label: '开始', prop: 'serviceStart', width: '120px' },
        { label: '厅房准备', prop: 'loungeReady', width: '120px' },
        { label: '信息核对', prop: 'infoConfirm', width: '120px' },
        { label: '安检预约', prop: 'secureNotify', width: '120px' },
        { label: '安检到达', prop: 'secureArrive' },
        { label: '保安预约', prop: 'terminalDoor1', width: '120px' },
        { label: '保安到达', prop: 'terminalDoor2' },
        { label: '监护预约', prop: 'survilnNotify', width: '120px' },
        { label: '监护到达', prop: 'survilnArrive' },
        { label: '行李搬运预约', prop: 'lungageAppoint', width: '120px' },
        { label: '行李搬运到达', prop: 'lungageArrive', width: '120px' },
        { label: '车辆预约', prop: 'carAppoint', width: '120px' },
        { label: '车辆到达', prop: 'carArrive' },
        { label: '登机完成预约', prop: 'boardingNotify', width: '120px' },
        { label: '登机完成到达', prop: 'boardingConfirm' }
        // { label: '分配手持', prop: 'assignHandset' },
      ],
      ApiObject,
      queryParams: {
        flight_date: ''
      }
    }
  },
  computed: {
  },
  methods: {
    createdAspectBefore() {
      this.queryParams.flight_date = this.$moment().format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
