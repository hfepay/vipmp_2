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
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi'
import ReportMixins from '../report-mixins'

export default {
  name: 'IncomeReport',
  mixins: [Mixins, ReportMixins],
  data() {
    return {
      summaryText: '总计',
      summaryFields: ['subtotalPeople'],
      pagination: false,
      ApiObject: ApiObject,
      headers: [
        { label: '序号', type: 'index' },
        { label: '项目单位', prop: 'airline' },
        {
          label: 'VIP旅客',
          children: [
            { label: '主卡', prop: 'mainCountVIP' },
            { label: '随行', prop: 'accompanyCountVIP' }
          ]
        },
        {
          label: 'CIP旅客',
          children: [
            { label: '主卡', prop: 'mainCountCIP' },
            { label: '随行', prop: 'accompanyCountCIP' }
          ]
        },
        {
          label: '持卡旅客',
          children: [
            { label: '主卡', prop: 'mainCountCard' },
            { label: '随行', prop: 'accompanyCountCard' }
          ]
        },
        {
          label: '头等舱旅客',
          children: [
            { label: '主卡', prop: 'mainCountFirst' },
            { label: '随行', prop: 'accompanyCountFirst' }
          ]
        },
        { label: '清算合计', prop: 'subLiquidation' },
        { label: '非清算合计', prop: 'subLiquidationFalse' },
        { label: '总人数', prop: 'subtotalPeople' }
      ],
      listData: {},
      queryParams: {
        date: this.$moment().format('YYYY-MM')
      }
    }
  },
  computed: {
    listApi() {
      return this.ApiObject.FirstClassIncome
    },
    exportApi() {
      return this.ApiObject.FirstClassIncomeExport
    }
  },
  mounted() {
    console.log('打印的', this.tableData)
  },
  methods: {
    getTableDataAspectAfter(data) {
      this.listData = data
    },
    getFinalTableData(data) {
      return data.list
    },
    getSummaries({ columns, data }) {
      const {
        mainCountVIPCount, accompanyCountVIPCount, mainCountCIPCount,
        accompanyCountCIPCount, mainCountCardCount, accompanyCountCardCount,
        mainCountFirstCount, accompanyCountFirstCount, subLiquidation, subLiquidationFalse, allPeople
      } = this.listData
      return ['总计', 'N/A', mainCountVIPCount, accompanyCountVIPCount, mainCountCIPCount,
        accompanyCountCIPCount, mainCountCardCount, accompanyCountCardCount,
        mainCountFirstCount, accompanyCountFirstCount, subLiquidation, subLiquidationFalse, allPeople]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
