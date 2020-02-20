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
        <el-button type="primary" @click.stop="Mixins_$ExportExcel">
          导出
        </el-button>
      </template>
      <!--操作-->
      <template #operator="{scope}">
        <el-button type="primary" @click.stop="DetailVisible(scope.row)">
          查看
        </el-button>
        <el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          编辑
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          冻结
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          解冻
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
      </base-form>
    </base-dialog>
    <base-dialog
      title="详情"
      :visible.sync="DetailDialogVisible"
      top="5vh"
      custom-class="dialogHeight"
      width="530px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form
        ref="form"
        :model="DialogForm"
        :form-headers="DetailFormHeaders"
        :show-default-foot="false"
        label-width="120px"
        @cancel="DetailDialogVisible = false"
      >
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
        { label: '卡种ID', prop: 'id' },
        { label: '卡种名称', prop: 'id' },
        { label: '持卡方类型', prop: 'id', type: 'select' },
        { label: '持卡方身份证', prop: 'id' },
        { label: '激活时间', prop: 'id', type: 'daterange' },
        { label: '发行渠道ID', prop: 'id' },
        { label: '发行渠道名称', prop: 'id' },
        { label: '持卡方名称', prop: 'id' },
        { label: '联系电话', prop: 'id' },
        { label: '到期时间', prop: 'id', type: 'daterange' },
        { label: '卡号', prop: 'id' },
        { label: '状态', prop: 'id', type: 'select' }
      ],
      /* 搜索条件 */
      QueryParams: {
        id: ''
      },
      ApiObject,
      /* 弹窗表头 */
      DialogFormHeaders: [
        {
          label: '客户类型：',
          prop: 'id',
          type: 'select',
          options: [{ label: '个人', value: 1 }, { label: '企业单位', value: 2 }]
        },
        { label: '持卡方名称：', prop: 'id' },
        { label: '办理人身份证号：', prop: 'id' },
        { label: '联系电话：', prop: 'id' }
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
        { label: '卡号', prop: 'id' },
        { label: '卡种ID', prop: 'id' },
        { label: '卡种名称', prop: 'id' },
        { label: '面值', prop: 'id' },
        { label: '发行渠道ID', prop: 'id' },
        { label: '发行渠道名称', prop: 'id' },
        { label: '持卡方类型', prop: 'id' },
        { label: '持卡方名称', prop: 'id' },
        { label: '办理人身份证号', prop: 'id' },
        { label: '联系电话', prop: 'id' },
        { label: '卡余额', prop: 'id' },
        { label: '激活时间', prop: 'id' },
        { label: '到期时间', prop: 'id' },
        { label: '状态', prop: 'id' },
        { label: '操作', slot: 'operator', fixed: 'right', width: '200' }
      ],
      DetailDialogVisible: false,
      DetailFormHeaders: [
        { label: '卡号', prop: 'id', type: 'text' },
        { label: '卡种ID', prop: 'id', type: 'text' },
        { label: '卡种名称', prop: 'id', type: 'text' },
        { label: '面值', prop: 'id', type: 'text' },
        { label: '支持折扣产品', prop: 'id', type: 'text' },
        { label: '权益折扣', prop: 'id', type: 'text' },
        { label: '发行渠道ID', prop: 'id', type: 'text' },
        { label: '发行渠道名称', prop: 'id', type: 'text' },
        { label: '持卡方类型', prop: 'id', type: 'text' },
        { label: '持卡方名称', prop: 'id', type: 'text' },
        { label: '办理人身份证号', prop: 'id', type: 'text' },
        { label: '联系电话', prop: 'id', type: 'text' },
        { label: '绑定用户ID', prop: 'id', type: 'text' },
        { label: '卡余额', prop: 'id', type: 'text' },
        { label: '激活时间', prop: 'id', type: 'text' },
        { label: '到期时间', prop: 'id', type: 'text' },
        { label: '有效期', prop: 'id', type: 'text' },
        { label: '到期规则', prop: 'id', type: 'text' },
        { label: '状态', prop: 'id', type: 'text' }]
    }
  },
  methods: {
    async DetailVisible(obj) {
      const res = this.Mixins_QueryItemByRequest ? await this.Mixins_GetApi.call(this.ApiObject, obj.id) : { data: obj }
      const data = res.data
      const finalEditParams = this.Mixins_GetFinalEditParams(data)
      this.DialogForm = { ...this.DialogForm, ...finalEditParams }
      this.Mixins_$SetDialogOperate(this.Mixins_$OperateType.EDIT)
      this.DetailDialogVisible = true
      return true
    }
  }
}
</script>
