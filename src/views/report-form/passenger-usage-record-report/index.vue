<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="pageObj"
      :headers="headers"
      :data="tableData"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
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
          <el-button type="primary" @click="airlineCompanyDialogVisible = true">
            筛选航空公司
          </el-button>
        </base-form>
      </template>
      <template slot="top-right">
        <!--<el-button  type="primary" @click="add">新增</el-button>-->
      </template>
      <template slot="append">
        <summary-line label="小计:" :text="subtotal" />
        <summary-line label="总计:" :text="total" />
        <summary-line label="累计:" :text="cumulative" />
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
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi'
import SummaryLine from '../SummaryLine'
import FlightCompanySearchDialog from '../FlightCompanySearchDialog'
export default {
  name: 'PassengerUsageRecordReport',
  components: { FlightCompanySearchDialog, SummaryLine },
  mixins: [Mixins],
  data() {
    return {
      subtotal: '',
      total: '',
      cumulative: '',
      ApiObject: ApiObject,
      firstClassAccomCount: '',
      airlineCompanyDialogVisible: false,
      pagination: false,
      headers: [
        { label: '序号', type: 'index' },
        { label: '日期', prop: 'receptionTime' },
        { label: '航班号', prop: 'flightCode' },
        { label: '机号', prop: 'aircraftCode' },
        { label: '姓名', prop: 'name' },
        { label: '卡号', prop: 'settlementCardNum' },
        { label: '座位号', prop: 'seatNum' },
        { label: '舱位', prop: 'cabinLevel' },
        { label: '类型', prop: 'selType' },
        { label: '所属公司', prop: 'airline' },
        { label: '客票号', prop: 'ticketNo' },
        { label: '贵宾室', prop: 'hallCn' },
        { label: '备注', prop: 'remarks' }
      ],
      queryParams: {
        // date: this.$moment().format('YYYY-MM'),
        timeRange: [],
        checkedFlightCompanys: '',
        airlineCode2: ''
      }
    }
  },
  computed: {
    listApi() {
      return this.ApiObject.cabinRegistration
    },
    exportApi() {
      return this.ApiObject.cabinRegistrationExport
    }
  },
  methods: {
    // 获取页面数据
    getFinalTableData(data) {
      return data.list
    },
    getTableDataAspectAfter(data) {
      this.subtotal = data.subtotal
      this.total = data.total
      this.cumulative = data.cumulative
    }
  }
}
</script>
