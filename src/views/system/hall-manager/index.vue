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
      width="930px"
      center
      @closed="reset"
    >
      <base-form :model="DialogForm"  ref="form" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-row>
          <el-col :span="8">
            <el-form-item label="房间名称：" prop="roomName">
              <el-input v-model="dialogForm.roomName" placeholder="请输入房间名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在区域：" prop="location">
              <el-select v-model="dialogForm.location" clearable placeholder="请选择所在区域">
                <el-option
                  v-for="(item, $index) in hallOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
          <!--<el-form-item label="包厅费用：" prop="hallCost">-->
          <!--<el-input v-model="dialogForm.hallCost" type="number" placeholder="请输入包厅费用" />-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="面积：" prop="area">
              <el-input v-model="dialogForm.area" type="number" placeholder="请输入面积" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="座位数：" prop="seatQuantities">
              <el-input v-model="dialogForm.seatQuantities" type="number" placeholder="请输入座位数" />
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">
            <el-form-item label="人数预警：" prop="peopleAlert">
              <el-input v-model="dialogForm.peopleAlert" type="number" placeholder="请输入人数预警" />
            </el-form-item>
          </el-col>-->
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="dialogForm.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排列顺序：" prop="sequence">
              <el-input v-model="dialogForm.sequence" type="number" placeholder="请输入排列顺序" />
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">
            <el-form-item label="是否包厅：" prop="hallIf">
              <el-switch
                v-model="dialogForm.hallIf"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>-->
          <!--<el-col :span="24">
            <el-form-item label="接待客户类型：" prop="receptionCustomerType">
              <el-checkbox-group v-model="dialogForm.receptionCustomerType">
                <el-checkbox
                  v-for="(item, $index) in customerTypeOptions"
                  :key="$index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>-->
        </el-row>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeHallApi'
import DictionaryApi from '@/api/module/beTrade/BeTradeDatadictApi'
export default {
  name: 'HallManager',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      hallOptions: [],
      customerTypeOptions: [],
      pagination: false,
      ApiObject: ApiObject,
      dialogFormRules: {
        roomNumber: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        roomName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        sequence: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        area: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        seatQuantities: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        peopleAlert: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        hallCost: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        location: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        hallIf: '',
        roomNumber: '',
        roomName: '',
        sequence: '',
        area: '',
        seatQuantities: '',
        peopleAlert: '',
        hallCost: '',
        remark: '',
        receptionCustomerType: [],
        location: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        // { label: '房间编号', prop: 'roomNumber' },
        { label: '房间名称', prop: 'roomName' },
        { label: '所在区域', prop: 'locationName' },
        { label: '面积', prop: 'area' },
        { label: '座位数', prop: 'seatQuantities' },
        // { label: '人数预警', prop: 'peopleAlert' },
        { label: '备注', prop: 'remark' },
        { label: '排列顺序', prop: 'sequence' },
        { label: '操作', slot: 'operator' }
      ]
    }
  },
  methods: {
    async edit(obj) {
      const res = await this.ApiObject.get(obj.id)
      this.dialogForm = { ...res.data }
      this.dialogForm.receptionCustomerType = (this.dialogForm.receptionCustomerType + '').split(',')
      this.dialogVisible = true
    },
    getDialogFormParams() {
      const data = { ...this.dialogForm }
      data.receptionCustomerType = data.receptionCustomerType.join(',')
      return data
    },
    createdAspectBefore() {
      this.initHallOptions()
      this.initCustomerTypeOptions()
    },
    async initHallOptions() {
      this.hallOptions = await DictionaryApi.getOptionsByType(this.$utils.DICTIONARY_ENUM.HALL_AREA)
    },
    async initCustomerTypeOptions() {
      this.customerTypeOptions = await DictionaryApi.getOptionsByType(this.$utils.DICTIONARY_ENUM.CUSTOMER_TYPE)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
