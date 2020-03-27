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
          <el-form-item label="姓名：">
            <el-input v-model="queryParams.name" placeholder="按姓名查询" />
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="queryParams.phoneNum" placeholder="按手机号查询" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
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
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="DialogForm.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNum">
          <el-input v-model="DialogForm.phoneNum" placeholder="手机号" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beMisc/BeMiscAddressBookApi'
export default {
  name: 'AddressBook',
  mixins: [Mixins],
  data() {
    return {
      ApiObject,
      dialogFormRules: {
        name: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        phoneNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        phoneNum: '',
        name: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '姓名', prop: 'name' },
        { label: '手机号', prop: 'phoneNum' },
        { label: '添加时间', prop: 'createTime' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        keyword: '',
        status: '',
        timeRange: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
