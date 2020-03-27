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
            />
            <el-form-item label="航班：">
              <el-input v-model="queryParams.flight_code" placeholder="按航班查询" />
            </el-form-item>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beDispatch/BeDispatchFlightApi'
export default {
  name: 'VipRecording',
  mixins: [Mixins],
  data() {
    return {
      headers: [
        { label: '序号', type: 'index' },
        { label: '航班号', prop: 'flightCode' },
        { label: '预计起飞', prop: 'etd' },
        { label: '航班状态', prop: 'flightStatus' },
        { label: '登机口', prop: 'gate' },
        { label: '总人数', prop: 'totalHeadcount' },
        { label: '引领通知', prop: 'leadingNotify' },
        { label: '登机通知', prop: 'boardingNotify' },
        { label: '手动通知', prop: 'onceNotify' },
        { label: '车辆预约', prop: 'vehicleReserve' },
        { label: '车辆到达', prop: 'vehicleArrive' },
        { label: '安检通知', prop: 'checkNotify' },
        { label: '安检通知', prop: 'checkArrive' }
      ],
      ApiObject: ApiObject,
      queryParams: {
        flight_date: '',
        flight_code: ''
      }
    }
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
