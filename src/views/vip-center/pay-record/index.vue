<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="pageObj"
      :headers="headers"
      :data="tableData"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
          <el-form-item label="交易订单号：">
            <el-input v-model="queryParams.id" placeholder="请输入交易订单号" />
          </el-form-item>
          <el-form-item label="交易时间：">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="会员卡种：">
            <el-select v-model="queryParams.cardType" clearable placeholder="请输入会员卡种">
              <el-option
                v-for="(item, $index) in cardTypeOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="交易类型：">
            <!--  <el-select v-model="queryParams.orderType" clearable placeholder="请输入交易类型">
              <el-option
                v-for="(item, $index) in settlementOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>-->

            <el-select v-model="queryParams.orderType" clearable placeholder="交易类型">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.orderType)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="持卡方名称：">
            <el-input v-model="queryParams.name" placeholder="请输入持卡方名称" />
          </el-form-item>
          <el-form-item label="办理人身份证：">
            <el-input v-model="queryParams.idCard" placeholder="请输入办理人身份证" />
          </el-form-item>
          <el-form-item label="卡号：">
            <el-input v-model="queryParams.cardNo" placeholder="请输入卡号" />
          </el-form-item>
          <el-form-item label="交易状态：">
            <el-select v-model="queryParams.status" clearable placeholder="请输入交易状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.tradingStatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
      <template slot="top-right" />
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <!--0未进行退款操作，显示退款按钮   1进行过退款操作，显示已退款-->
        <template v-if="scope.row.status === '退款成功'">
          -
        </template>
        <el-button v-else-if="scope.row.tk == 0" type="danger" @click.stop="refund(scope.row)">
          退款
        </el-button>
        <template v-else-if="scope.row.tk == 1">
          已退款
        </template>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatPayRecordApi'
import ProductOrderApi from '@/api/module/wechat/WechatProductOrderApi'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import CardTypeApi from '@/api/module/wechat/WechatCardTypeApi'
export default {
  name: 'PayRecord',
  mixins: [Mixins],
  data() {
    return {
      cardTypeOptions: [],
      settlementOptions: [],
      ApiObject: ApiObject,
      headers: [
        { label: '交易订单号', prop: 'id' },
        { label: '交易时间', prop: 'createTime' },
        { label: '持卡方名称', prop: 'name' },
        { label: '办理人身份证', prop: 'idCard' },
        { label: '交易金额', prop: 'pay' },
        { label: '交易类型', prop: 'orderType' },
        { label: '会员卡种', prop: 'cardType' },
        { label: '卡号', prop: 'cardNo' },
        { label: '交易状态', prop: 'status' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        id: '',
        cardType: '',
        orderType: '',
        name: '',
        idCard: '',
        cardNo: '',
        status: '',
        timeRange: []
      }
    }
  },
  methods: {
    createdAspectBefore() {
      this.initCardTypeOptions()
      this.initSettlementOptions()
    },
    async refund(obj) {
      const { pay } = obj
      await this.$confirm(`对方使用的是珠海机场会员卡支付，确认退款${pay}元?`, '确定退款')
      const res = await ProductOrderApi.pay({ ...obj, type: 1 })
      this.$message.success(res.message)
      this.init()
    },
    async initCardTypeOptions() {
      this.cardTypeOptions = await CardTypeApi.getOptions()
    },
    async initSettlementOptions() {
      this.settlementOptions = await SettlementApi.getOptions()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
