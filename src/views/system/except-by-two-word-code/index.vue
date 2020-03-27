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
      <!--<template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item label="关键字：">
            <el-input v-model="queryParams.keyword" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="时间：">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="queryParams.status" clearable placeholder="申报结果">
              <el-option
                v-for="(item, $index) in $utils.toOptions($utils.statusConstans)"
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
      </template>-->
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <template slot="airlineCompany" slot-scope="{scope}">
        {{ JSON.parse(scope.row.airlineCompany).join(',') }}
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <!-- <el-button @click.stop="edit(scope.row)">
          查看
        </el-button>-->
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
      width="530px"
      center
      @closed="reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="二字码：" prop="airlineCode">
          <el-input v-model="dialogForm.airlineCode" placeholder="类型">
            <!--<template slot="append" >
              <el-button @click="queryByTwoCode">查询</el-button>
            </template>-->
          </el-input>
        </el-form-item>
        <el-form-item label="要排除的公司：" prop="itemCode">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="dialogForm.checkedFlightCompanys" @change="handleCheckedFlightCompanyChange">
            <el-checkbox v-for="(item, $index) in flightCompanys" :key="$index" :label="item.label" />
          </el-checkbox-group>
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import AircraftApi from '@/api/module/beTrade/BeTradeAircraftApi'
import ApiObject from '@/api/module/beTrade/BeTradeAirlineCodeInfoApi'
export default {
  name: 'ExceptByTwoWordCode',
  mixins: [Mixins],
  data() {
    return {
      checkAll: false,
      checkedFlightCompanys: [],
      flightCompanys: [],
      isIndeterminate: true,
      ApiObject: ApiObject,
      dialogFormRules: {
        airlineCode: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        airlineCompany: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        airlineCode: '',
        airlineCompany: '',
        checkedFlightCompanys: []
      },
      headers: [
        { label: '二字码', prop: 'airlineCode' },
        { label: '搜索排除项', prop: 'airlineCompany', slot: 'airlineCompany' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        keyword: '',
        status: '',
        timeRange: []
      }
    }
  },
  watch: {
    'dialogForm.airlineCode': function(newVal) {
      if (/^\w{2}$/g.test(newVal)) {
        this.queryByTwoCode()
      }
    }
  },
  methods: {
    resetAfter() {
      this.flightCompanys = []
    },
    editAfter() {
      this.$set(this.dialogForm, 'checkedFlightCompanys', JSON.parse(this.dialogForm.airlineCompany))
    },
    async queryByTwoCode() {
      this.flightCompanys = await AircraftApi.getCompanysOptions(this.dialogForm.airlineCode)
    },
    getFinalDialogFormParams(data) {
      data.airlineCompany = JSON.stringify(data.checkedFlightCompanys)
      return data
    },
    handleCheckAllChange(val) {
      this.dialogForm.checkedFlightCompanys = val ? this.flightCompanys.map(item => item.label) : []
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
<style lang="scss" scoped>
</style>
