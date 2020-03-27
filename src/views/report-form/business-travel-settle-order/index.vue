<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :pagination="Mixins_Pagination"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <base-date-picker
              v-model="queryParams.date"
              type="month"
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
      <template slot="table">
        <div v-for="(detail, $index) in details" :key="$index" style="margin-bottom: 50px">
          <table border="1" style="width: 100%" cellpadding="4">
            <thead>
              <tr>
                <th colspan="2">
                  {{ detail.startTime }}至{{ detail.endTime }}
                </th>
              </tr>
              <tr>
                <th>客户名称</th>
                <th>{{ detail.companyName }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>贵宾服务收费标准</td>
                <td>
                  出发—贵宾厅房休息：<br>
                  隔离区外：{{ detail.priceOut }}元/人次·2小时<br>
                  隔离区内：{{ detail.priceIn }}元/人次·2小时<br>
                  到达—接机（举接待牌接指定贵客）：{{ detail.zrjjPrice }}元/次<br>
                  <!--包厅:{{ detail.btPrice }}元/次/2小时<br>-->
                  专车:{{ detail.zcjjPrice }}元/次<br>
                </td>
              </tr>
              <tr>
                <td>接待批次及人数</td>
                <td>
                  {{ detail.date }}服务总计：{{ detail.yamount }}元：<br>
                  1、出发——贵宾厅房休息共计{{ detail.amount }}元：<br>
                  a)   隔离区外{{ detail.numberOut }}人，共计{{ detail.totalPriceOut }}元<br>
                  b)   隔离区内{{ detail.numberIn }}人，共计{{ detail.totalPriceIn }}元<br>
                  2、到达——接机{{ detail.numberZrjj }}单，共计{{ detail.totalZrjjPrice }}元<br>
                  <!--                  3、包厅: {{ detail.numberBt }}次，共计{{ detail.totalBtPrice }}元<br>-->
                  3、专车: {{ detail.numberZcjj }}单，共计{{ detail.totalZcjjPrice }}元<br>
                </td>
              </tr>
              <tr>
                <td>总金额（人民币）</td>
                <td>
                  小写：{{ detail.totalAmount }}元<br>
                  大写：{{ detail.totalAmountCN }}<br>
                </td>
              </tr>
              <tr>
                <td>珠海市珠港机场管理有限公司收款账户</td>
                <td>
                  开户名：珠海市珠港机场管理有限公司<br>
                  开户银行：交通银行珠海分行<br>
                  开户账号：444000091018170039333
                </td>
              </tr>
              <tr>
                <td>说明</td>
                <td>
                  1、上述价格为含税报价。<br>
                  2、发票类型：增值税普通发票<br>
                  3、付款时间要求：请于{{ new Date().getFullYear() }}年{{ new Date().getMonth() + 1 }}月15日前，完成上述款项的支付。<br>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </base-table-layout>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '../../../api/module/beTrade/BeTradeReportApi'
import ReceptionSelect from '../../common/select/ReceptionSelect'
import BusinessTravelSelect from '../../common/select/ReceptionSelect2'

export default {
  name: 'BusinessTravel',
  components: { BusinessTravelSelect, ReceptionSelect },
  mixins: [Mixins],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Mixins_Pagination: false,
      ApiObject,
      details: null,
      queryParams: {
        date: '',
        companyId: ''
      }
    }
  },
  computed: {
    listApi() { return this.ApiObject.slCompanySettlement },
    exportApi() { return this.ApiObject.slCompanySettlementExport }
  },
  methods: {
    getFinalTableData(data) {
      return []
    },
    getTableDataAspectAfter(data) {
      this.details = data
    }
  }

}

</script>

<style lang="scss" scoped>
  table + table{
    margin-top: 20px;
  }
  tbody{
    tr {
      td{
        width: 50%;
        text-align: center;
        + td{
          text-align: left;
        }
      }
    }
  }
</style>
