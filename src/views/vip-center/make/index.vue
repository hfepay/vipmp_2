<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item label="卡种ID：">
            <el-input v-model="queryParams.typeCode" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="卡种名称：">
            <el-input v-model="queryParams.typeName" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="制卡时间：">
            <el-date-picker
              v-model="queryParams.timeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="发行渠道ID：">
            <el-input v-model="queryParams.channelCode" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="发行渠道名称：">
            <el-input v-model="queryParams.channelName" placeholder="关键字" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
          <el-button type="primary" @click="Mixins_$Add">
            制卡
          </el-button>
        </base-form>
      </template>
      <template slot="layout-operate" />
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="download(scope.row)">
          下载卡号
        </el-button>
      </template>
    </base-table-layout>
    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="卡种ID：" prop="typeId">
          <el-select v-model="DialogForm.typeId" clearable placeholder="卡种ID">
            <el-option
              v-for="(item, $index) in cardTypeOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item><el-form-item label="发行渠道ID：" prop="channelId">
          <el-select v-model="DialogForm.channelId" clearable placeholder="发行渠道ID">
            <el-option
              v-for="(item, $index) in channelOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="制卡数量：" prop="madeCount">
          <el-input v-model.number="dialogForm.madeCount" type="number" placeholder="制卡数量" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatCardGenApi'
import WechatCardTypeApi from '@/api/module/wechat/WechatCardTypeApi'
import WechatChannelApi from '@/api/module/wechat/WechatChannelApi'
export default {
  name: 'Make',
  mixins: [Mixins],
  data() {
    return {
      ApiObject,
      WechatCardTypeApi: WechatCardTypeApi,
      WechatChannelApi: WechatChannelApi,
      cardTypeOptions: [],
      channelOptions: [],
      dialogFormRules: {
        typeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        channelId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        madeCount: [{ required: true, message: '数量必须为正数', trigger: 'change', type: 'integer' }]
      },
      DialogForm: {
        typeId: '',
        channelId: '',
        madeCount: 0
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '卡种ID', prop: 'typeCode' },
        { label: '卡种名称', prop: 'typeName' },
        { label: '面值', prop: 'value' },
        { label: '发行渠道ID', prop: 'channelCode' },
        { label: '发行渠道名称', prop: 'channelName' },
        { label: '制卡数量', prop: 'madeCount' },
        { label: '制卡时间', prop: 'createTime' },
        { label: '制卡人', prop: 'creator' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        typeCode: '',
        keyword: '',
        status: '',
        timeRange: []
      }
    }
  },
  methods: {
    async download({ id }) {
      await ApiObject.singleExport(id)
    },
    createdAspectBefore() {
      this.selectAllCardType()
      this.selectAllChannel()
    },
    // 查询卡种ID下拉列表
    async selectAllCardType() {
      this.cardTypeOptions = await this.WechatCardTypeApi.getOptions()
    },
    // 下拉列表   查询所有的发行渠道
    async selectAllChannel() {
      this.channelOptions = await this.WechatChannelApi.getOptions()
    },
    getFinalQueryParams(queryParams) {
      if (queryParams.start_time) {
        queryParams.creatTimeMin = queryParams.start_time
        delete queryParams.start_time
      }
      if (queryParams.end_time) {
        queryParams.creatTimeMax = queryParams.end_time
        delete queryParams.end_time
      }
      return queryParams
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
