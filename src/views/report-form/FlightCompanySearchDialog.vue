<template>
  <base-dialog
    title="筛选航空公司"
    :visible.sync="airlineCompanyDialogVisible"
    width="600px"
    center
    @closed="$emit('closed')"
  >
    <base-form
      ref="form"
      :rules="airlineCompanyDialogFormRules"
      :model="airlineCompanyDialogForm"
      label-width="120px"
      @submit="submitAirlineCompanyDialogForm"
      @cancel="airlineCompanyDialogVisible = false"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="航司名称：" prop="airline">
            <el-input v-model="airlineCompanyDialogForm.airline" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二字码：" prop="airlineCode2">
            <el-input v-model="airlineCompanyDialogForm.airlineCode2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="三字码：" prop="airlineCode3">
            <el-input v-model="airlineCompanyDialogForm.airlineCode3" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button style="width: 100%" @click="queryAirlineCompany">
              查询
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="查询结果：" prop="itemCode">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <el-checkbox-group v-model="queryParams.checkedFlightCompanys" @change="handleCheckedFlightCompanyChange">
          <el-checkbox v-for="(item, $index) in flightCompanys" :key="$index" :label="item.label" />
        </el-checkbox-group>
      </el-form-item>
    </base-form>
  </base-dialog>
</template>

<script>
import AircraftApi from '../../api/module/beTrade/BeTradeAircraftApi'
export default {
  name: 'FlightCompanySearchDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      airlineCompanyDialogFormRules: {
        airlineCode2: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      queryParams: {
        checkedFlightCompanys: []
      },
      flightCompanys: [],
      isIndeterminate: true,
      checkAll: false,
      airlineCompanyDialogVisible: this.visible,
      airlineCompanyDialogForm: {
        airline: '',
        airlineCode3: '',
        airlineCode2: ''
      }
    }
  },
  watch: {
    visible: function(newVal) {
      this.airlineCompanyDialogVisible = newVal
    }
  },
  methods: {
    filterNullCondition(data) {
      /* 过滤 */
      for (const condition in data) {
        if (!data[condition] && (data[condition] !== 0 || data[condition] !== false)) {
          delete data[condition]
        }
      }
      return data
    },
    async queryAirlineCompany() {
      this.queryParams.checkedFlightCompanys = []
      this.flightCompanys = await AircraftApi.airlineListOptions(this.filterNullCondition(this.airlineCompanyDialogForm))
    },
    submitAirlineCompanyDialogForm() {
      this.$emit('update:visible', false)
      this.$emit('update:airlineCode2', this.airlineCompanyDialogForm.airlineCode2)
      this.$emit('update:checkedFlightCompanys', this.queryParams.checkedFlightCompanys.join(','))
      this.$emit('init', false)
    },
    handleCheckAllChange(val) {
      this.queryParams.checkedFlightCompanys = val ? this.flightCompanys.map(item => item.label) : []
      this.isIndeterminate = false
    },
    handleCheckedFlightCompanyChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.flightCompanys.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.flightCompanys.length
    }
  }
}
</script>

<style scoped>

</style>
