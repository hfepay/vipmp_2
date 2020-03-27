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
      <template #layout-search>
        <base-form
          :inline="true"
          :show-label="false"
          placeholder-type="search"
          :model.sync="QueryParams"
          :form-headers="QueryParamsHeaders"
          :show-default-foot="false"
        >
          <el-button type="primary" @click="Mixins_$Search">
            查询
          </el-button>
          <el-button type="primary" @click="Mixins_$Reset_QueryParams">
            重置
          </el-button>
        </base-form>
      </template>
      <template #layout-operate>
        <base-input
          style="width: 200px"
          placeholder="请扫码登记旅客"
        >
          <template slot="append">
            <el-button type="primary" @click="Mixins_$Add">
              +
            </el-button>
          </template>
        </base-input>
      </template>
      <!--操作-->
      <template #operator="{scope}">
        <el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          编辑
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>
    <order-dialog :visible.sync="Mixins_$DialogVisible" />
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/account/AccountSysUserApi'
import OrderDialog from '../components/OrderDialog'
export default {
  name: 'ReceptionRegister',
  components: { OrderDialog },
  mixins: [Mixins],
  data() {
    return {
      /* 搜索条件表单表头 */
      QueryParamsHeaders: [
        { label: '客户类型', prop: 'id' },
        { label: '接待单位', prop: 'id' },
        { label: '旅客姓名', prop: 'id' },
        { label: '航班号', prop: 'id' },
        { label: '卡号', prop: 'id' },
        { label: '接待时间', prop: 'id' }
      ],
      /* 搜索条件 */
      QueryParams: {
        id: '',
        timeRange: '',
        status: ''
      },
      ApiObject,
      /* 弹窗表头 */
      DialogFormHeaders: [
        { label: '', prop: '' }
      ],
      /* 弹窗对象 */
      DialogForm: {
        id: ''
      },
      /* 校验规则 */
      dialogFormRules: {
        a: [{ required: true, message: '必填项不能为空' }]
      },
      Headers: [
        { label: '旅客姓名', prop: 'id' },
        { label: '旅客类型', prop: 'id' },
        { label: '航班', prop: 'id' },
        { label: '接待时间', prop: 'id' },
        { label: '客户类型', prop: 'id' },
        { label: '接待单位', prop: 'id' },
        { label: '客户类型', prop: 'id' },
        { label: '结算类型', prop: 'id' },
        { label: '卡号', prop: 'id' },
        { label: '服务类型', prop: 'id' },
        { label: '服务厅房', prop: 'id' },
        { label: '状态', prop: 'id' },
        { label: '操作', slot: 'operator' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
