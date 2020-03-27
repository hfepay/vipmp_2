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
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <template>
              {{ queryParams.dutyDay }}
            </template>
          </el-form-item>
        </base-form>
      </template>
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
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
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="reset"
    >
      <base-form :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
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
