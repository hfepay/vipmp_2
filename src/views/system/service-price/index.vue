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
      width="930px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-row>
          <el-col :span="8">
            <el-form-item label="服务类型：" prop="typeId">
              <el-select v-model="DialogForm.typeId" clearable placeholder="服务类型" style="width: 100%">
                <el-option
                  v-for="(item, $index) in serviceTypeOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="!isJJ">
            <el-col :span="8">
              <el-form-item label="厅房：" prop="houseId">
                <el-select v-model="DialogForm.houseId" clearable placeholder="厅房" style="width: 100%">
                  <el-option
                    v-for="(item, $index) in hallOptions"
                    :key="$index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="hall-info-container">
              <span>面积：</span><span>{{ hallInfo.area }}㎡ </span>
              <span>座位数：</span><span>{{ hallInfo.seatQuantities }} </span>
            </el-col>
          </template>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格：" prop="price">
              <el-input v-model="DialogForm.price" type="number" placeholder="请输入价格">
                <template slot="append">
                  元
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排列顺序：" prop="orderNum">
              <el-input v-model="DialogForm.orderNum" type="number" placeholder="请输入排列顺序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务标准：" prop="serviceStandard">
          <el-input v-model="DialogForm.serviceStandard" type="textarea" placeholder="请输入服务标准" />
        </el-form-item>
        <el-form-item label="差异化服务：" prop="serviceDifferent">
          <el-input v-model="DialogForm.serviceDifferent" type="textarea" placeholder="请输入差异化服务" />
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model="DialogForm.remarks" type="textarea" placeholder="请输入差异化服务" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeServicePriceApi'
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
export default {
  name: 'ServicePrice',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      serviceTypeOptions: [],
      hallOptions: [],
      Mixins_Pagination: false,
      ApiObject,
      dialogFormRules: {
        typeId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        houseId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        serviceStandard: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        serviceDifferent: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      DialogForm: {
        typeId: '',
        houseId: '',
        price: '',
        serviceStandard: '',
        serviceDifferent: '',
        remarks: '',
        orderNum: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '服务类型', prop: 'typeName' },
        { label: '区域', prop: 'region' },
        { label: '厅房', prop: 'houseName' },
        { label: '价格', prop: 'price' },
        { label: '面积', prop: 'area' },
        { label: '座位数', prop: 'seatNum' },
        { label: '服务标准', prop: 'serviceStandard' },
        { label: '差异化服务项目', prop: 'serviceDifferent' },
        { label: '备注', prop: 'remarks' },
        { label: '操作', slot: 'operator' }
      ]
    }
  },
  computed: {
    isJJ() { // 是否为接机服务
      const id = this.dialogForm.typeId
      const res = this.serviceTypeOptions.filter(item => item.value === id)[0]
      return Boolean(res) && ['专人接机', '专车接机'].includes(res.label)
    },
    hallInfo() {
      const houseId = this.dialogForm.houseId
      const res = this.hallOptions.filter(item => item.value === houseId)[0] || {}
      return res.item || {}
    }
  },
  methods: {
    getFinalDialogFormParams(data) {
      if (this.isJJ) {
        delete data.houseId
      }
      return data
    },
    createdAspectBefore() {
      this.initServiceTypeOptions()
      this.initHallOptions()
    },
    async initServiceTypeOptions() {
      this.serviceTypeOptions = await DictionaryApi.getOptionsByType(this.$utils.DICTIONARY_ENUM.SERVER_TYPE)
    },
    async initHallOptions() {
      this.hallOptions = await HallApi.getOptions()
    }
  }
}
</script>
<style lang="scss" scoped>
.hall-info-container{
  line-height: 28px;
  padding-left: 60px;
}
</style>
