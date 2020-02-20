<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="pageObj"
      :headers="headers"
      :pagination="pagination"
      :data="tableData"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
          <el-form-item>
            <template>
              {{ queryParams.dutyDay }}
            </template>
          </el-form-item>
        </base-form>
      </template>
      <template slot="top-right">
        <el-button type="primary" @click="add">
          新增
        </el-button>
        <base-upload
          style="margin-left: 10px"
          :action="`${ApiObject.BASEURL}/excel`"
          accept=".xls,.xlsx"
          :show-file-list="false"
          @success="uploadSuccess"
        >
          <el-button type="primary">
            导入excel表
          </el-button>
        </base-upload>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="edit(scope.row, scope.$index)">
          修改
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
      <base-form :model="dialogForm" :rules="dialogFormRules" label-width="120px" @submit="submit" @cancel="dialogVisible = false">
        <el-form-item label="类型：" prop="itemCode">
          <el-input v-model="dialogForm.itemCode" placeholder="类型" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="dialogForm.status" clearable placeholder="状态">
            <el-option
              v-for="(item, $index) in $Contants.toOptions($Contants.statusConstans)"
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
import ApiObject from '@/api/module/beDispatch/BeDispatchDispatcherScheduleApi'
export default {
  name: 'StaffManager',
  mixins: [Mixins],
  data() {
    return {
      headers: [
        { label: '序号', type: 'index' },
        { label: '姓名', prop: 'name' },
        { label: '性别', prop: 'workerNumber' },
        { label: '年龄', prop: 'workerNumber' },
        { label: '手机号', prop: 'roleName' },
        { label: '所属班组', prop: 'teamName' },
        { label: '操作', slot: 'operator' }
      ],
      pagination: this.page,
      ApiObject: ApiObject,
      dialogFormRules: {},
      dialogForm: {
      },
      queryParams: {
        dutyDay: ''
      }
    }
  },
  computed: {
  },
  methods: {
    createdAspectBefore() {
      this.queryParams.dutyDay = this.$moment().format('YYYY-MM-DD')
    },
    uploadSuccess(response, file, fileList) {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
