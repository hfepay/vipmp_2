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
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <template v-if="scope.row.Mixins_$IsEdit != 0">
          <el-button
            type="danger"
            @click.stop="Mixins_$Del(scope.row)"
          >
            删除
          </el-button>
        </template>
      </template>
    </base-table-layout>
    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="reset"
    >
      <base-form
        ref="form"
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="120px"
        @submit="Mixins_$Submit"
        @cancel="Mixins_$DialogVisible = false"
      >
        <el-form-item label="航司二字码：" prop="airlineCode">
          <el-input v-model="dialogForm.airlineCode" />
        </el-form-item>
        <el-form-item label="航空公司名称：" prop="airline">
          <el-select v-model="dialogForm.airline">
            <el-option
              v-for="(item, $index) in airLineList"
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
import ApiObject from '../../../api/module/beTrade/BeTradeAirlineHqApi'
export default {
  name: 'AirlineTab',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      queryKey: 'airlineCode',
      airLineList: [],
      ApiObject: ApiObject,
      dialogFormRules: {
        airlineCode: [{ required: true, message: '航司二字码不能为空' }],
        airline: [{ required: true, message: '航空公司名称不能为空' }]
      },
      dialogForm: {
        airlineCode: '',
        airline: ''
      },
      headers: [
        { type: 'index', label: '序号' },
        { label: '航司二字码', prop: 'airlineCode' },
        { label: '航空公司名称', prop: 'airline' },
        { label: '操作', slot: 'operator' }
      ]
    }
  },
  watch: {
    'dialogForm.airlineCode': async function(newVal, oldVal) {
      if (/\w{2}/.test(newVal)) {
        await this.initAirLineList()
        if (!this.airLineList.find(item => item.value === this.dialogForm.airline)) {
          this.dialogForm.airline = ''
        }
      }
    }
  },
  methods: {
    async initAirLineList() {
      this.airLineList = await ApiObject.getOptionsByCode(this.dialogForm.airlineCode)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
