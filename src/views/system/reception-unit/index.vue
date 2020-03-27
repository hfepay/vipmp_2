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
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="edit(scope.row)">
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
      width="630px"
      center
      @closed="reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="接待单位名称：" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入接待单位名称" />
        </el-form-item>
        <el-form-item label="客户类型：" prop="datadictId">
          <el-select v-model="dialogForm.datadictId" clearable placeholder="请选择客户类型" style="width: 100%">
            <el-option
              v-for="(item, $index) in customerOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司编码：" prop="companyCode">
          <el-input v-model="dialogForm.companyCode" placeholder="请输入公司编码" />
        </el-form-item>
        <el-form-item label="排列顺序：" prop="orderNum">
          <el-input v-model="dialogForm.orderNum" type="number" placeholder="请输入排列顺序" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeReceiveOrgApi'
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
export default {
  name: 'ReceptionUnit',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      customerOptions: [],
      pagination: false,
      ApiObject: ApiObject,
      dialogFormRules: {
        name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        datadictId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        companyCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dialogForm: {
        name: '',
        datadictId: '',
        orderNum: '',
        companyCode: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '接待单位名称', prop: 'name' },
        { label: '客户类型', prop: 'datadictName' },
        { label: '公司编码', prop: 'companyCode' },
        { label: '排列顺序', prop: 'orderNum' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
      }
    }
  },
  methods: {
    resetAfter() {
      this.dialogForm.orderNum = ''
    },
    initAspectAfter() {
      this.initCustomerOptions()
    },
    async initCustomerOptions() {
      this.customerOptions = await DictionaryApi.getOptionsByType(this.$utils.DICTIONARY_ENUM.CUSTOMER_TYPE)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
