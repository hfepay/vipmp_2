<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      :pagination="Mixins_Pagination"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeReportApi'
export default {
  name: 'LiquidationReport',
  mixins: [Mixins],
  data() {
    return {
      timeRangeToCamelCase: true,
      pagination: false,
      ApiObject: ApiObject,
      baseHeaders: [
        { label: '发生地机场', prop: 'airport' },
        { label: '航班日期', prop: 'serveDate' },
        { label: '结算日期', prop: 'settleDate' },
        { label: '航班号', prop: 'flightCode' },
        { label: '机号', prop: 'aircraft' },
        { label: '起降标识', prop: 'flag' }
      ],
      dynamicHeaders: [
        { label: '头等舱旅客服务', prop: 'tdclk' },
        { label: '持卡旅客服务', prop: 'cklv' },
        { label: '贵宾旅客服务', prop: 'gblk' },
        { label: '国内贵宾（重要旅客）服务', prop: 'gngb' },
        { label: '国内头等舱、公务舱旅客服务', prop: 'gntdc' },
        { label: '重要旅客服务', prop: 'zylk' },
        { label: '头等舱旅客随行服务费', prop: 'tdcsxlk' },
        { label: '重要旅客随行服务费', prop: 'zylksx' },
        { label: '持卡旅客随行服务费', prop: 'cklksx' }
      ],
      queryParams: {
        month: '',
        timeRange: []
      }
    }
  },
  computed: {
    headers() {
      return [...this.baseHeaders, ...this.dynamicHeaders]
    },
    listApi() {
      return this.ApiObject.acLiquidation
    },
    exportApi() {
      return this.ApiObject.acLiquidationExport
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
