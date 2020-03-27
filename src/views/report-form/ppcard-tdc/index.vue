<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :pagination="Mixins_Pagination"
      :data="Mixins_$TableData"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
              :default-value="new Date()"
            />
          </el-form-item>
          <el-form-item label="电子记录：">
            <el-switch
              v-model="queryParams.isElectronicRecord"
              active-value="1"
              inactive-value="0"
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
      <template slot="append">
        <summary-line label="总数:">
          <div style="display: flex; width: 100%">
            <div style="flex: 1" class="br-1" />
            <div style="flex: 1" class="br-1" />
            <div style="flex: 1" class="br-1" />
            <div style="flex: 1" class="br-1">
              {{ ppCabinTotal }}
            </div>
            <div style="flex: 1" class="br-1">
              {{ ppCabinCompanyTotal }}
            </div>
            <div style="flex: 1" class="br-1">
              {{ totalPrice }}
            </div>
          </div>
        </summary-line>
        <summary-line label="总计:" :text="totalStr" />
      </template>
    </base-table-layout>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi'
import SummaryLine from '../SummaryLine'

export default {
  name: 'BusinessTravel',
  components: { SummaryLine },
  mixins: [Mixins],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      totalCountData: '',
      Mixins_Pagination: false,
      ApiObject,
      businessOptions: [], // 商旅公司下拉框
      // 其他项
      ppCabinTotal: 0,
      ppCabinCompanyTotal: 0,
      totalPrice: 0,
      totalStr: '',
      timeRangeToCamelCase: true,
      queryParams: {
        /* date: this.$moment().format('YYYY-MM'),*/
        timeRange: [showMonthFirstDay(), showMonthLastDay()],
        isElectronicRecord: '1',
        companyName: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '日期', prop: 'serveDate' },
        { label: '姓名', prop: 'passengerName' },
        { label: 'vip号码', prop: 'settlementCardNum' },
        { label: '本人', prop: 'ppCabin' },
        { label: '随行', prop: 'ppCabinCompany' },
        { label: '小计金额', prop: 'countPrice' }
      ]
    }
  },
  computed: {
    listApi() { return this.ApiObject.PPCabinPassenger },
    exportApi() { return this.ApiObject.PPCabinPassengerExport }
  },
  methods: {
    getFinalTableData(data) {
      return data ? data.passengerRespList : []
    },

    getTableDataAspectAfter(data) {
      this.ppCabinTotal = data.ppCabinTotal
      this.ppCabinCompanyTotal = data.ppCabinCompanyTotal
      this.totalPrice = data.totalPrice
      this.totalStr = data.totalStr
    }
  }
}
// 获取当月第一天
function showMonthFirstDay() {
  const NowDate = new Date()
  const MonthFirstDay = new Date(NowDate.getFullYear(), NowDate.getMonth(), 1)
  const M = Number(MonthFirstDay.getMonth()) + 1
  return MonthFirstDay.getFullYear() + '-' + M.toString().padStart(2, '0') + '-0' + MonthFirstDay.getDate()
}
// 获取当月最后一天
function showMonthLastDay() {
  const NowDate = new Date()
  const MonthNextFirstDay = new Date(NowDate.getFullYear(), NowDate.getMonth() + 1,
    1)
  const MonthLastDay = new Date(MonthNextFirstDay - 86400000)
  const M = Number(MonthLastDay.getMonth()) + 1
  return MonthLastDay.getFullYear() + '-' + M.toString().padStart(2, '0') + '-' + MonthLastDay.getDate()
}

</script>

<style scoped>
.br-1{
    border-right: 1px solid #ececec;
}
</style>
