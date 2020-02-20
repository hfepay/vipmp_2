<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="pageObj"
      :headers="headers"
      :data="tableData"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false" />
      </template>
      <template slot="top-right">
        <el-button type="primary" @click="add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="edit(scope.row)">
          编辑
        </el-button>
        <el-button type="danger" @click.stop="del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>
    <base-dialog
      :title="dialogForm['id']?'修改':'新增'"
      :visible.sync="dialogVisible"
      width="530px"
      center
      @closed="reset"
    >
      <base-form ref="form" :model="dialogForm" :rules="dialogFormRules" label-width="120px" @submit="submit" @cancel="dialogVisible = false">
        <el-form-item label="模板名称：" prop="title">
          <el-input v-model="dialogForm.title" placeholder="模板名称" />
        </el-form-item>
        <el-form-item label="模板内容：" prop="content">
          <el-input v-model="dialogForm.content" type="textarea" autosize placeholder="模板内容" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beMisc/BeMiscTemplateApi'
export default {
  name: 'MessageTemplate',
  mixins: [Mixins],
  data() {
    return {
      ApiObject: ApiObject,
      dialogFormRules: {
        title: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        content: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        title: '',
        content: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '模板名称', prop: 'title' },
        { label: '模板内容', prop: 'content' },
        { label: '创建时间', prop: 'createTime' },
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
