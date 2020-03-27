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
      width="630px"
      center
      @closed="reset"
    >
      <base-form :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="航空公司全称：" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入航空公司全称" />
        </el-form-item>
        <el-form-item label="简称：" prop="shortName">
          <el-input v-model="dialogForm.shortName" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="编码：" prop="code">
          <el-input v-model="dialogForm.code" placeholder="请输入编码"  :maxlength="3" />
        </el-form-item>
        <el-form-item label="排列顺序：" prop="orderCode">
          <el-input v-model="dialogForm.orderCode" type="number" placeholder="请输入排列顺序" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeAirlineApi'
export default {
  name: 'FlightCompany',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      pagination: false,
      ApiObject: ApiObject,
      dialogFormRules: {
        name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        shortName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        code: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
          { min: 2, max: 3, message: '长度在 2 到 3 个字符', trigger: 'blur' }
        ],
        orderCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dialogForm: {
        name: '',
        shortName: '',
        code: '',
        orderCode: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '航空公司全称', prop: 'name' },
        { label: '简称', prop: 'shortName' },
        { label: '编码', prop: 'code' },
        { label: '排列顺序', prop: 'orderCode' },
        { label: '操作', slot: 'operator' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
