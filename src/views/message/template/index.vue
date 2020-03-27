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
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false" />
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
        <el-form-item label="模板名称：" prop="title">
          <el-input v-model="DialogForm.title" placeholder="模板名称" />
        </el-form-item>
        <el-form-item label="模板内容：" prop="content">
          <el-input v-model="DialogForm.content" type="textarea" autosize placeholder="模板内容" />
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
      ApiObject,
      dialogFormRules: {
        title: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        content: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        title: '',
        content: ''
      },
      Headers: [
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
