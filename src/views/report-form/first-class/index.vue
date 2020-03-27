<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      show-summary
      :summary-method="getSummaries"
      :pagination="Mixins_Pagination"
      :data="tableData[0]&&tableData[0].list"
    >
      <span v-if="tableData[0]" slot="tableTop" class="tableTitle">{{ tableData[0].startDate + ' -- ' + tableData[0].endDate }}</span>
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <!--<el-form-item>
            <airline-select v-model="queryParams.airline" />
          </el-form-item>-->

          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
          <el-button type="primary" @click="airlineCompanyDialogVisible = true">
            筛选航空公司
          </el-button>
        </base-form>
      </template>
    </base-table-layout>
    <template v-for="(tableDataItem, index) in tableData">
      <base-table-layout
        v-if="index!==0"
        :page-obj="Mixins_$PageObj"
        :headers="Headers"
        show-summary
        :summary-method="getSummaries"
        :pagination="Mixins_Pagination"
        :data="tableDataItem.list"
      >
        <span slot="tableTop">{{ tableDataItem.startDate + ' -- ' + tableDataItem.endDate }}</span>
      </base-table-layout>
    </template>
    <flight-company-search-dialog
      :checked-flight-companys.sync="queryParams.checkedFlightCompanys"
      :airline-code2.sync="queryParams.airlineCode2"
      :visible.sync="airlineCompanyDialogVisible"
      @init="init"
      @closed="airlineCompanyDialogVisible = false"
    />
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi'
import AirlineSelect from '../../common/select/AirlineSelect'
import ReportMixins from '../report-mixins'
import FlightCompanySearchDialog from '../FlightCompanySearchDialog'

export default {
  name: 'FirstClass',
  components: { AirlineSelect, FlightCompanySearchDialog },
  mixins: [Mixins, ReportMixins],
  data() {
    return {
      summaryFields: ['peopleNum', 'totalAmount'],
      Mixins_Pagination: false,
      airlineCompanyDialogVisible: false,
      ApiObject,
      airlineOptions: [], // 航空公司下拉框
      queryParams: {
        timeRange: [],
        // date: this.$moment().format('YYYY-MM'),
        airlineCode: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '名称', prop: 'settlementName' },
        { label: '人数', prop: 'peopleNum' },
        { label: '标准', prop: 'standardPrice' },
        { label: '金额', prop: 'totalAmount' }
      ]
    }
  },

  computed: {
    listApi() {
      return this.ApiObject.cabinSummary
    },
    exportApi() {
      return this.ApiObject.cabinSummaryExport
    }
  },

  methods: {
    getFinalTableData(data) {
      console.log(data)
      return data || []
    },
    getTableDataAspectAfter() {
      console.log(this.tableData)
    }
  }

}

</script>

<style scoped>
</style>
