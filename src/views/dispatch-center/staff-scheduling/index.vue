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
            <template v-if="!isHistoryPage">
              {{ queryParams.dutyDay }}
            </template>
            <el-date-picker
              v-else
              v-model="queryParams.dutyDay"
              value-format="yyyy-MM-dd"
              range-separator="至"
              placeholder="请选择时间"
              @change="search"
            />
          </el-form-item>
        </base-form>
      </template>
      <template slot="layout-operate">
        <template v-if="!isHistoryPage">
          <el-link type="primary" style="margin-right: 10px" @click="toHistoryPage">
            历史排班记录
          </el-link>
          <base-upload
            v-if="!isHistoryPage"
            :action="`${ApiObject.BASEURL}/excel`"
            accept=".xls,.xlsx"
            :before-upload="beforeUpload"
            :show-file-list="false"
            @success="uploadSuccess"
          >
            <el-button type="primary">
              导入excel表
            </el-button>
          </base-upload>
        </template>
        <el-button v-if="isHistoryPage" type="primary" @click="exportExcel">
          导出excel表
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="del(scope.row, scope.$index)">
          删除
        </el-button>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beDispatch/BeDispatchDispatcherScheduleApi'
export default {
  name: 'StaffScheduling',
  mixins: [Mixins],
  props: {
    page: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pagination: this.page,
      ApiObject,
      dialogFormRules: {},
      dialogForm: {
      },
      queryParams: {
        dutyDay: ''
      }
    }
  },
  computed: {
    headers() {
      const headers = [
        { label: '序号', type: 'index' },
        { label: '姓名', prop: 'name' },
        { label: '工号', prop: 'workerNumber' },
        { label: '角色', prop: 'roleName' },
        { label: '所属班组', prop: 'teamName' },
        { label: '服务厅房', prop: 'hallName' },
        { label: '备注', prop: 'description' }
      ]
      // const operate = [{ label: '操作', slot: 'operator' }]
      // return this.isHistoryPage ? headers : [...headers, ...operate]
      return headers
    },
    isHistoryPage() {
      return this.type === 'history'
    }
  },
  methods: {
    beforeUpload(file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        return true
      }
      this.$message.error('请上传以xls或xlsx结尾的文件')
      return false
    },
    toHistoryPage() {
      this.$router.push({ path: '/dispatchCenter/scheduleHistory' })
    },
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
