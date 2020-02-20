<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="pageObj"
      :headers="headers"
      :data="tableData"
      :pagination="pagination"
      show-summary
      :summary-method="getSummaries"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.date"
              value-format="yyyy-MM"
              type="month"
            />
          </el-form-item>
          <el-form-item>
            <!--<airline-select v-model="queryParams.companyName" />-->
            <el-button type="primary" @click="airlineCompanyDialogVisible = true">
              筛选航空公司
            </el-button>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
      <template slot="table">
        <base-table
          style="margin-bottom: 50px"
          v-for="(table, $index) in tableData"
          show-summary
          :summary-method="getSummaries"
          :key="$index"
          :data="table.list"
          :headers="headers"
        />
      </template>
    </base-table-layout>
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
import ApiObject from '@/api/module/beTrade/BeTradeReportApi'
import AirlineSelect from '../../common/select/AirlineSelect'
import ReportMixins from '../report-mixins'
import FlightCompanySearchDialog from '../FlightCompanySearchDialog'

export default {
  name: 'OrderReport',
  components: { AirlineSelect, FlightCompanySearchDialog },
  mixins: [Mixins, ReportMixins],
  data() {
    return {
      pagination: false,
      summaryFields: ['money'],
      ApiObject: ApiObject,
      headers: [
        // { label: '序号', type: 'index' },
        { label: '费用项目', prop: 'costItems' },
        { label: '金额', prop: 'money' },
        { label: '备注', prop: 'remark' }
      ],
      airlineCompanyDialogVisible: false,
      queryParams: {
        checkedFlightCompanys: '',
        queryParams: '',
        date: '',
        companyName: ''
      }
    }
  },
  computed: {
    listApi() { return this.ApiObject.cabinACCustomerBill },
    exportApi() { return this.ApiObject.cabinACCustomerBillExport }
  }
}
</script>
<style lang="scss" scoped>
</style>
