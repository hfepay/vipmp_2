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
          新增
        </el-button>
        <el-button type="primary" @click.stop="Mixins_$ExportExcel">
          导出
        </el-button>
      </template>
      <!--操作-->
      <template #operator="{scope}">
        <el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          查看
        </el-button>
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
          <el-form-item label="折扣率" prop="id1">
            <base-input v-model="DialogForm.id1" type="number">
              <template #append>折</template>
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
import { CARD_TYPE_RADIO, INVALIDATION_RULE_RADIO, EXPIRATION_DATE_RADIO } from '@/constants/module/memberCenterConstant'

export default {
  name: 'ReceptionRegister',
  mixins: [Mixins],
  data() {
    return {
      /* 搜索条件表单表头 */
      QueryParamsHeaders: [
        { label: '卡种ID', prop: 'id' },
        { label: '卡种名称', prop: 'id' }
      ],
      /* 搜索条件 */
      QueryParams: {
        id: ''
      },
      ApiObject,
      /* 弹窗表头 */
      DialogFormHeaders: [
        { label: '卡种名称：', prop: 'id' },
        { label: '卡类型：', prop: 'id', type: 'radio', options: CARD_TYPE_RADIO },
        { label: '卡面值：', prop: 'id' },
        { label: '销售价：', prop: 'id' },
        { label: '有效期：', prop: 'id', type: 'radio', options: EXPIRATION_DATE_RADIO },
        { label: '失效规则', prop: 'id', type: 'radio', options: INVALIDATION_RULE_RADIO },
        { label: '支持折扣的服务：', prop: 'id' },
        { label: '折扣率：', slot: 'id1' },
        { label: '权益介绍：', prop: 'id', type: 'textarea' }
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
        { label: '卡种ID', prop: 'id' },
        { label: '卡种名称', prop: 'id' },
        { label: '面值', prop: 'id' },
        { label: '销售价', prop: 'id' },
        { label: '支持折扣的服务', prop: 'id' },
        { label: '权益介绍', prop: 'id' },
        { label: '折扣率', prop: 'id' },
        { label: '有效期', prop: 'id' },
        { label: '失效规则', prop: 'id' },
        { label: '创建日期', prop: 'id' },
        { label: '已制卡数量', prop: 'id' },
        { label: '操作', slot: 'operator' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
