<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      :pagination="Mixins_Pagination"
      show-summary
      :summary-method="getSummaries"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
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
          v-for="(table, $index) in tableData"
          :key="$index"
          style="margin-bottom: 50px"
          show-summary
          :summary-method="getSummaries"
          :data="table.list"
          :headers="Headers"
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
      Mixins_Pagination: false,
      summaryFields: ['money'],
      ApiObject,
      Headers: [
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
