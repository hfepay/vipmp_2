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
          <el-form-item label="旅客姓名：">
            <el-input v-model="queryParams.passengerName" placeholder="旅客姓名" />
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input v-model="queryParams.idCard" placeholder="身份证号" />
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="queryParams.mobile" placeholder="手机号" />
          </el-form-item>
          <el-form-item label="所属单位：">
            <el-input v-model="queryParams.companyName" placeholder="所属单位" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
      <template slot="imgName" slot-scope="{scope}">
        <el-link v-if="scope.row.imgName" type="primary" @click="preview(scope.row)">
          查看
        </el-link>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          编辑
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
        <el-form-item label="旅客姓名：" prop="name">
          <el-input v-model="DialogForm.name" placeholder="旅客姓名" />
        </el-form-item>
        <el-form-item label="身份证号：" prop="idCard">
          <el-input v-model="DialogForm.idCard" placeholder="身份证号" />
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select v-model="DialogForm.sex" clearable placeholder="性别">
            <el-option
              v-for="(item, $index) in $Contants.toOptions($Contants.sexType)"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="DialogForm.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="客户类型：" prop="customerTypeId">
          <el-select v-model="DialogForm.customerTypeId" clearable placeholder="客户类型">
            <el-option
              v-for="(item, $index) in customerTypeOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位：" prop="companyName">
          <el-input v-model="DialogForm.companyName" placeholder="所属单位" />
        </el-form-item>
        <el-form-item label="结算类型：" prop="settlementTypeId">
          <el-select v-model="DialogForm.settlementTypeId" clearable placeholder="结算类型">
            <el-option
              v-for="(item, $index) in settlementOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="喜好：" prop="fancy">
          <el-input v-model="DialogForm.fancy" placeholder="喜好" />
        </el-form-item>
      </base-form>
    </base-dialog>
    <!--预览图片弹窗-->
    <base-dialog
      :visible.sync="previewDialogVisible"
      style="text-align: center"
    >
      <el-image
        style="width: fit-content;"
        :src="imageUrl"
        fit="contain"
      />
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatCustomerApi'
import DictionaryApi from '@/api/module/beTrade/BeTradeDatadictApi'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import { validatePhoneOrNull } from '../../../utils/validate/validate-element'
export default {
  name: 'CustomerInfo',
  mixins: [Mixins],
  data() {
    return {
      imageUrl: '',
      previewDialogVisible: false,
      customerTypeOptions: [],
      settlementOptions: [],
      ApiObject,
      dialogFormRules: {
        passengerName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        idCard: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        sex: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        mobile: [{ trigger: 'change', validator: validatePhoneOrNull }],
        customerTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // companyName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        settlementTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        selType: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      DialogForm: {
        passengerName: '',
        idCard: '',
        sex: '',
        mobile: '',
        customerTypeId: '',
        companyName: '',
        settlementTypeId: '',
        selType: '',
        fancy: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '旅客姓名', prop: 'passengerName' },
        { label: '身份证号', prop: 'idCard' },
        { label: '性别', prop: 'sex', format: this.$Contants.sexType },
        { label: '身份证头像', prop: 'imgName', slot: 'imgName' },
        { label: '手机号', prop: 'mobile' },
        { label: '客户类型', prop: 'customerType' },
        { label: '所属单位', prop: 'companyName' },
        { label: '结算类型', prop: 'selType' },
        { label: '喜好', prop: 'fancy' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        passengerName: '',
        idCard: '',
        sex: '',
        mobile: '',
        customerType: '',
        companyName: '',
        selType: '',
        fancy: ''
      }
    }
  },
  methods: {
    preview(obj) {
      this.imageUrl = this.$utils.Base64ImgWrapper(obj.imgName)
      this.previewDialogVisible = true
    },
    createdAspectBefore() {
      this.initCustomerTypeOptions()
      this.initSettlementOptions()
    },
    async initCustomerTypeOptions() {
      this.customerTypeOptions = await DictionaryApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.CUSTOMER_TYPE)
    },
    async initSettlementOptions() {
      this.settlementOptions = await SettlementApi.getOptions()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
