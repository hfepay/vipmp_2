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
          <el-form-item>
            <el-select v-model="queryParams.slId" clearable filterable placeholder="请选择商旅公司">
              <el-option
                v-for="(item, $index) in businessOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.status" placeholder="请选择合同状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.contractStatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item placeholder="合同保证金">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
              start-placeholder="合同开始时间"
              end-placeholder="合同开始时间"
            />
          </el-form-item>

          <el-form-item>
            <base-date-picker
              v-model="queryParams.closeTimeRange"
              start-placeholder="合同到期时间"
              end-placeholder="合同到期时间"
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
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="edit(scope.row)">
          修改
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>

    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="1000px"
      center
      @closed="reset"
    >
      <base-form
        ref="form"
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="150px"
        @submit="Mixins_$Submit"
        @cancel="Mixins_$DialogVisible = false"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同名称：" prop="contractName">
              <el-input
                v-model="dialogForm.contractName"
                placeholder="合同名称"
                :maxlength="50"
                style="width: 350px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商旅名称：" prop="slId">
              <el-select v-model="dialogForm.slId" filterable placeholder="请选择商旅公司" style="width: 325px">
                <el-option
                  v-for="(item, $index) in businessOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同有效期：" prop="timeRange">
              <el-date-picker
                v-model="dialogForm.timeRange"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同保证金：" prop="deposit">
              <el-input v-model="dialogForm.deposit" placeholder="合同保证金" type="text" :maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结算方式：" prop="settlementType">
              <el-input v-model="dialogForm.settlementType" placeholder="结算方式" type="textarea" :maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务内容" label-width="220px" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="收费标准(隔离区外)" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="收费标准(隔离区内)" label-width="150px" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出发：" prop="serviceContentStart">
              <el-input v-model="dialogForm.serviceContentStart" type="text" :maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px" prop="chargeStandardOutStart">
              <el-input v-model="dialogForm.chargeStandardOutStart" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px" prop="chargeStandardInStart">
              <el-input v-model="dialogForm.chargeStandardInStart" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务内容" label-width="220px" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="收费标准(专车接机)" label-width="150px" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="收费标准(专人接机)" label-width="150px" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="到达：" prop="serviceContentEnd">
              <el-input v-model="dialogForm.serviceContentEnd" type="text" :maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px" prop="chargeStandardOutEnd">
              <el-input v-model="dialogForm.chargeStandardOutEnd" type="text" :maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px" prop="chargeStandardInEnd">
              <el-input v-model="dialogForm.chargeStandardInEnd" type="text" :maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="合同扫描件上传：">
              <base-upload
                v-model="dialogForm.imgName"
                list-type="picture-card"
                :file-list="fileList"
              >
                <i class="el-icon-plus" />
              </base-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </base-form>
    </base-dialog>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import { validateTwoFloat } from '../../../utils/validate/validate-element'
import ReceiveOrgApi from '../../../api/module/beTrade/BeTradeReceiveOrgApi'
import ApiObject from '../../../api/module/beTrade/BeTradeBusinessContractApi'
import BaseUpload from '../../../components/upload/BaseUpload'

export default {
  name: 'BusinessContract',
  components: { BaseUpload },
  mixins: [Mixins],
  data() {
    return {
      timeRangeToCamelCase: true,
      dialogFormRules: {
        contractName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        slId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        timeRange: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        deposit: [{ required: true, validator: validateTwoFloat, trigger: 'change' }],
        settlementType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serviceContentStart: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serviceContentEnd: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        chargeStandardInStart: [{ required: true, validator: validateTwoFloat, trigger: 'change' }],
        chargeStandardOutStart: [{ required: true, validator: validateTwoFloat, trigger: 'change' }],
        chargeStandardInEnd: [{ required: true, validator: validateTwoFloat, trigger: 'change' }],
        chargeStandardOutEnd: [{ required: true, validator: validateTwoFloat, trigger: 'change' }]

      },
      ApiObject: ApiObject,
      businessOptions: [], // 商旅公司下拉框
      queryParams: {
        status: '1',
        slId: ''
      },
      fileList: [],
      dialogForm: {
        contractName: '',
        slId: '',
        timeRange: [],
        closeTimeRange: [],
        deposit: '0.00',
        settlementType: '',
        serviceContentStart: '',
        chargeStandardInStart: '0.00',
        chargeStandardOutStart: '0.00',
        serviceContentEnd: '',
        chargeStandardInEnd: '0.00',
        chargeStandardOutEnd: '0.00',
        imgName: []
      },

      headers: [
        { label: '序号', type: 'index' },
        { label: '对方名称', prop: 'theirName' },
        { label: '合同名称', prop: 'contractName' },
        { label: '合同保证金', prop: 'deposit' },
        { label: '服务内容', prop: 'serviceContent' },
        { label: '收费标准', prop: 'chargeStandard' },
        { label: '合同有效期', prop: 'effectiveDate' },
        { label: '结算方式', prop: 'settlementType' },
        { label: '操作', slot: 'operator', width: 160 }
      ]
    }
  },
  methods: {
    resetAfter() {
      this.dialogForm.deposit = '0.00'
      this.dialogForm.chargeStandardInStart = '0.00'
      this.dialogForm.chargeStandardOutStart = '0.00'
      this.dialogForm.chargeStandardInEnd = '0.00'
      this.dialogForm.chargeStandardOutEnd = '0.00'
      this.fileList = []
    },
    async createdAspectBefore() {
      this.businessOptions = await ReceiveOrgApi.getBusinessTravelOptions()
    },
    getDialogFormParams() {
      const data = { ...this.dialogForm }
      data.startTime = this.dialogForm.timeRange[0]
      data.endTime = this.dialogForm.timeRange[1]
      delete data.timeRange
      !this.$utils.isArray(data.imgName) && (data.imgName = data.imgName.split(',').filter(item => item))
      return data
    },
    getFinalQueryParams(dialogForm) {
      if (dialogForm.closeTimeRange) {
        dialogForm.startCloseTime = dialogForm.closeTimeRange[0]
        dialogForm.endCloseTime = dialogForm.closeTimeRange[1]
      }
      delete dialogForm.closeTimeRange
      return dialogForm
    },
    async editAfter(res) {
      const startTime = `${this.dialogForm.startTime}`
      const endTime = `${this.dialogForm.endTime} `
      this.$set(this.dialogForm, 'timeRange', [])
      this.$set(this.dialogForm.timeRange, 0, this.$moment(startTime).format('YYYY-MM-DD'))
      this.$set(this.dialogForm.timeRange, 1, this.$moment(endTime).format('YYYY-MM-DD'))
      this.fileList = this.dialogForm.imgName.map(item => {
        return {
          name: item,
          url: this.$utils.imgWrapper(item)
        }
      })
    }

  }

}

</script>

<style scoped>

</style>
