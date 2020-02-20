<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="pageObj"
      :headers="headers"
      :pagination="pagination"
      show-summary
      :summary-method="getSummaries"
      :data="tableData"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
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
      summaryFields: ['zkNum', 'sxNum'],
      totalData: '',
      pagination: false,
      timeRangeToCamelCase: true,
      ApiObject: ApiObject,
      businessOptions: [], // 商旅公司下拉框
      queryParams: {
        date: '',
        timeRange: [],
        companyId: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '日期', prop: 'date' },
        { label: '航班号', prop: 'flightCode' },
        { label: '休息室名称', prop: 'hallCN' },
        { label: '宾客名称', prop: 'name' },
        { label: '卡类型', prop: 'settlement' },
        { label: '卡号', prop: 'cardNo' },
        { label: '会员人数', prop: 'zkNum' },
        { label: '随行人数', prop: 'sxNum' },
        { label: '手机号', prop: 'mobile' },
        { label: '服务时间', prop: 'serveDate' },
        { label: '客户签字', prop: '' },
        { label: '备注', prop: 'remarkContent' }
      ]
    }
  },
  computed: {
    listApi() { return this.ApiObject.slCustomerServe },
    exportApi() { return this.ApiObject.slCustomerServeExport }
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
