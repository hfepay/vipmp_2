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
          <el-form-item label="保障日期：">
            <el-date-picker
              v-model="queryParams.flight_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择保障日期"
            />
          </el-form-item>
          <el-form-item label="航班：">
            <el-input v-model="queryParams.flight_code" placeholder="按航班查询" />
          </el-form-item>

          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
    </base-table-layout>
    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="类型：" prop="itemCode">
          <el-input v-model="DialogForm.itemCode" placeholder="类型" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="DialogForm.status" clearable placeholder="状态">
            <el-option
              v-for="(item, $index) in $Contants.toOptions($Contants.statusConstans)"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beDispatch/BeDispatchPickupApi'
export default {
  name: 'ReceiveRecords',
  mixins: [Mixins],
  data() {
    return {
      ApiObject,
      dialogFormRules: {
        a: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      DialogForm: {
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '航班号', prop: 'flightCode' },
        { label: '预计到达', prop: 'eta' },
        { label: '航班状态', prop: 'flightStatus' },
        { label: '总人数', prop: 'headcount' },
        { label: '第一次通知', prop: 'firstNotify' },
        { label: '第二次通知', prop: 'secondNotify' },
        { label: '保障日期', prop: 'flightDate' }
      ],
      queryParams: {
        flight_date: '',
        flight_code: ''
      }
    }
  },
  methods: {
    createdAspectBefore() {
      this.queryParams.flight_date = this.$moment().format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
