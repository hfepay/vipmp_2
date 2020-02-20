<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="pageObj"
      :headers="headers"
      show-summary
      :summary-method="getSummaries"
      :pagination="pagination"
      :data="tableData[0]&&tableData[0].list"
    >
      <span v-if="tableData[0]" class="tableTitle" slot="tableTop">{{tableData[0].startDate + ' -- ' + tableData[0].endDate}}</span>
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
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
        :page-obj="pageObj"
        :headers="headers"
        show-summary
        :summary-method="getSummaries"
        :pagination="pagination"
        :data="tableDataItem.list"
      >
        <span slot="tableTop">{{tableDataItem.startDate + ' -- ' + tableDataItem.endDate}}</span>
      </base-table-layout>
    </template>
    <flight-company-search-dialog
      @init="init"
      :checkedFlightCompanys.sync="queryParams.checkedFlightCompanys"
      :airlineCode2.sync="queryParams.airlineCode2"
      :visible.sync="airlineCompanyDialogVisible"
      @closed="airlineCompanyDialogVisible = false"
    />
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins';
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi';
import AirlineSelect from '../../common/select/AirlineSelect';
import ReportMixins from '../report-mixins';
import FlightCompanySearchDialog from '../FlightCompanySearchDialog';

export default {
  name: 'FirstClass',
  components: { AirlineSelect, FlightCompanySearchDialog },
  mixins: [Mixins, ReportMixins],
  data() {
    return {
      summaryFields: ['peopleNum', 'totalAmount'],
      pagination: false,
      airlineCompanyDialogVisible: false,
      ApiObject: ApiObject,
      airlineOptions: [], // 航空公司下拉框
      queryParams: {
        timeRange: [],
        // date: this.$moment().format('YYYY-MM'),
        airlineCode: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '名称', prop: 'settlementName' },
        { label: '人数', prop: 'peopleNum' },
        { label: '标准', prop: 'standardPrice' },
        { label: '金额', prop: 'totalAmount' }
      ]
    };
  },

  computed: {
    listApi() {
      return this.ApiObject.cabinSummary;
    },
    exportApi() {
      return this.ApiObject.cabinSummaryExport;
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

};

</script>

<style scoped>
</style>
