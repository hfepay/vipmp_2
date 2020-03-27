<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :pagination="Mixins_Pagination"
      :data="Mixins_$TableData"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <!--<el-form-item label="航司名称：">
            <airline-select v-model="queryParams.hsId" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>-->
        </base-form>
      </template>
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          编辑
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
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
        <el-form-item label="清算项目名称：" prop="prjName">
          <el-input v-model="DialogForm.prjName" />
        </el-form-item>
        <el-form-item label="清算项目编码：" prop="prjCode">
          <el-input v-model="DialogForm.prjCode" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeAirlineProjectApi'
export default {
  name: 'FlightCompanyLiquidation',
  mixins: [Mixins],
  data() {
    return {
      Mixins_Pagination: false,
      ApiObject,
      dialogFormRules: {
        prjName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        prjCode: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        prjName: '',
        prjCode: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '清算项目名称', prop: 'prjName' },
        { label: '清算项目编码', prop: 'prjCode' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        hsId: ''
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
