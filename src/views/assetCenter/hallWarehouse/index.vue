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
        <el-button type="primary" @click.stop="Mixins_$Add">
          导出
        </el-button>
      </template>
      <!--操作-->
      <template #operator="{scope}">
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          使用
        </el-button>
      </template>
    </base-table-layout>
    <base-dialog
      :title="DialogForm['id']?'修改':'入库'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form
        ref="form"
        :model="DialogForm"
        :rules="DialogFormRules"
        :form-headers="DialogFormHeaders"
        label-width="120px"
        @submit="Mixins_$Submit"
        @cancel="Mixins_$DialogVisible = false"
      >
        <template #id1>
          <el-form-item label="使用数量：" prop="id1">
            <base-input v-model="DialogForm.id1" type="number">
              <template #append>二级单位</template>
            </base-input>
          </el-form-item>
        </template>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/account/AccountSysUserApi'

export default {
  name: 'ReceptionRegister',
  mixins: [Mixins],
  data() {
    return {
      /* 搜索条件表单表头 */
      QueryParamsHeaders: [
        { label: '物资ID', prop: 'id' },
        { label: '物资名称', prop: 'id' }
      ],
      /* 搜索条件 */
      QueryParams: {
        id: ''
      },
      ApiObject,
      /* 弹窗表头 */
      DialogFormHeaders: [
        { label: '物资信息：', prop: 'id' },
        { label: '使用数量：', slot: 'id1' },
        { label: '使用日期：', prop: 'id' },
        { label: '备注：', prop: 'id', type: 'textarea' }
      ],
      /* 弹窗对象 */
      DialogForm: {
        id: ''
      },
      /* 校验规则 */
      dialogFormRules: {
        id: [{ required: true, message: '必填项不能为空' }]
      },
      Headers: [
        { label: '物资名称', prop: 'id' },
        { label: '二级单位', prop: 'id' },
        { label: '当前库存数量', prop: 'id' },
        { label: '备注', prop: 'id' },
        { label: '操作', slot: 'operator', fixed: 'right', width: '200' }
      ]
    }
  },
  methods: {
    // 跳转到物资管理页面
    toManagement() {
    }
  }
}
</script>
