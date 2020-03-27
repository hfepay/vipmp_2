<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :pagination="Mixins_Pagination"
      show-summary
      :summary-method="getSummaries"
      :data="Mixins_$TableData"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.timeRange"
              type="monthrange"
            />
          </el-form-item>
          <el-form-item>
            <business-travel-select v-model="queryParams.companyId" />
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
    <template>
      <summary-line label="总计:" :text="totalData" />
    </template>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi'
import ReceptionSelect from '../../common/select/ReceptionSelect'
import ReportMixins from '../report-mixins'
import SummaryLine from '../SummaryLine'
import BusinessTravelSelect from '../../common/select/ReceptionSelect2'

export default {
  name: 'BusinessTravel',
  components: { BusinessTravelSelect, SummaryLine, ReceptionSelect },
  mixins: [Mixins, ReportMixins],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      summaryFields: ['num', 'totalAmount'],
      totalData: '',
      pagination: false,
      timeRangeToCamelCase: true,
      ApiObject: ApiObject,
      timeRangeToCamelCase: true,
      queryParams: {
        timeRange: [],
        companyId: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '日期', prop: 'date' },
        { label: '贵宾人数', prop: 'num' },
        { label: '结算金额(元)', prop: 'amount' },
        { label: '总计金额(元)', prop: 'totalAmount' }
      ]
    }
  },
  computed: {
    listApi() { return this.ApiObject.slCustomerAmount },
    exportApi() { return this.ApiObject.slCustomerAmountExport }
  },
  methods: {
    getFinalTableData(data) {
      return data ? data.list : []
    },
    getTableDataAspectAfter(data) {
      this.totalData = data.total
    }
  }

}

</script>

<style scoped>

</style>
