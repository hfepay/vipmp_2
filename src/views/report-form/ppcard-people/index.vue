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
          <el-date-picker
            v-model="queryParams.timeRange"
            value-format="yyyy-MM"
            format="yyyy-MM"
            type="monthrange"
            range-separator="-"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          />
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
          <el-row style="width: 100%">
            <el-col :span="6" class="br-1">
              -
            </el-col>
            <el-col :span="6" class="br-1">
              {{ totalPpNum }}
            </el-col>
            <el-col :span="6" class="br-1">
              {{ totalPpCompanyNum }}
            </el-col>
            <el-col :span="6" class="br-1">
              {{ totalCountNum }}
            </el-col>
          </el-row>
        </summary-line>
        <summary-line label="总计:" :text="totalCountData" />
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
      pagination: false,
      ApiObject: ApiObject,
      businessOptions: [], // 商旅公司下拉框
      totalCountNum: 0,
      totalPpCompanyNum: 0,
      totalPpNum: 0,
      timeRangeToCamelCase: true,
      queryParams: {
        /* date: this.$moment().format('YYYY-MM'),*/
        timeRange: [],
        companyName: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '日期', prop: 'date' },
        { label: '会员人数', prop: 'ppNum' },
        { label: '宾客人数', prop: 'ppCompanyNum' },
        { label: '总人数', prop: 'countNum' }
      ]
    }
  },
  computed: {
    listApi() { return this.ApiObject.PPCardPeople },
    exportApi() { return this.ApiObject.PPCardPeopleExport }
  },
  methods: {
    getFinalTableData(data) {
      return data ? data.list : []
    },
    getTableDataAspectAfter(data) {
      this.totalPpNum = data.totalPpNum
      this.totalPpCompanyNum = data.totalPpCompanyNum
      this.totalCountNum = data.totalCountNum
      this.totalCountData = data.totalCountData
    }

  }

}

</script>

<style scoped>
.br-1{
    border-right: 1px solid #ececec;
}
</style>
