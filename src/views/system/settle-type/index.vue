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
      width="630px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="客户类型：" prop="datadictId">
          <el-select v-model="DialogForm.datadictId" clearable placeholder="客户类型" style="width: 100%">
            <el-option
              v-for="(item, $index) in customerOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结算类型：" prop="selType">
          <el-input v-model="DialogForm.selType" placeholder="请输入结算类型" />
        </el-form-item>

        <el-form-item v-if="isFligntCompany" label="财务统计类型：" prop="financialType">
          <el-select v-model="DialogForm.financialType" clearable placeholder="财务统计类型">
            <el-option
              v-for="(item, $index) in $utils.toOptions($utils.financialTypes)"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排列顺序：" prop="orderNum">
          <el-input v-model="DialogForm.orderNum" type="number" placeholder="请输入排列顺序" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeSettlementApi'
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
export default {
  name: 'SettleType',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      customerOptions: [],
      Mixins_Pagination: false,
      ApiObject,
      dialogFormRules: {
        datadictId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        selType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        financialType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dialogForm: {
        datadictId: '',
        selType: '',
        orderNum: '',
        financialType: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '客户类型', prop: 'datadictName' },
        { label: '结算类型', prop: 'selType' },
        {
          label: '财务统计类型',
          prop: 'financialType',
          format: {
            1: 'VIP旅客',
            2: 'CIP旅客',
            3: '持卡旅客',
            4: '头等舱旅客'
          }
        },
        { label: '排列顺序', prop: 'orderNum' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
      }
    }
  },
  computed: {
    isFligntCompany() {
      return this.customerTypeCN === '航司客户'
    },
    customerTypeCN() {
      const obj = this.customerOptions.find(item => item.value == this.dialogForm.datadictId)
      return obj ? obj.label : ''
    }
  },
  methods: {
    getFinalDialogFormParams(data) {
      !this.isFligntCompany && delete data.financialType
      return data
    },
    Mixins_ResetAfter() {
      this.dialogForm.datadictId = ''
    },
    createdAspectBefore() {
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
