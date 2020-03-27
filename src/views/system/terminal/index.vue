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
        <el-button type="primary" @click.stop="add">
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
        <el-form-item label="编号：" prop="code">
          <el-input v-model="DialogForm.code" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="机器序列号：" prop="deviceCode">
          <el-input v-model="DialogForm.deviceCode" placeholder="请输入机器序列号" />
        </el-form-item>
        <el-form-item label="设备名称：" prop="name">
          <el-input v-model="DialogForm.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属班组：" prop="teamName">
          <el-input v-model="DialogForm.teamName" placeholder="请输入设备名称" />
        </el-form-item>
        <!--<el-form-item label="所属班组：" prop="teamId">-->
        <!--<el-select v-model="DialogForm.teamId" clearable placeholder="所属班组" style="width: 100%">-->
        <!--<el-option-->
        <!--v-for="(item, $index) in groupOptions"-->
        <!--:key="$index"-->
        <!--:label="item.label"-->
        <!--:value="item.value"-->
        <!--/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beDispatch/BeDispatchDispatchDeviceApi'
export default {
  name: 'Terminal',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      ApiObject,
      Mixins_Pagination: false,
      dialogFormRules: {
        code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        deviceCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        teamName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dialogForm: {
        code: '',
        deviceCode: '',
        name: '',
        teamId: ''
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '编号', prop: 'code' },
        { label: '机器序列号', prop: 'deviceCode' },
        { label: '名称', prop: 'name' },
        { label: '所属班组', prop: 'teamName' },
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
