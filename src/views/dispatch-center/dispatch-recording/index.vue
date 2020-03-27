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
          <!--<el-form-item>
            <el-date-picker
              v-model="queryParams.task_date"
              value-format="yyyy-MM-dd"
              range-separator="至"
              placeholder="请选择时间"
              @change="search"
            />
          </el-form-item>-->
          <el-form-item>
            <el-date-picker
              v-model="queryParams.createTime"
              value-format="yyyy-MM-dd"
              range-separator="至"
              placeholder="选择分配时间查询"
              @change="search"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.assignHandsetId" style="width: 100%" clearable placeholder="按分配手持查询">
              <el-option
                v-for="(item, $index) in dispatchDeviceOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.assignAttendant" style="width: 100%" clearable placeholder="按服务人员查询">
              <el-option
                v-for="(item, $index) in dispatcherScheduleApiOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.taskType" style="width: 100%" clearable placeholder="任务类型">
              <el-option
                v-for="(item, $index) in taskTypeOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.status" clearable placeholder="按状态查询">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.taskStatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
      <!--操作
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="edit(scope.row, scope.$index)">
          修改
        </el-button>
      </template> -->
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beDispatch/BeDispatchTaskApi'
import DatadictApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import DispatchDeviceApi from '../../../api/module/beDispatch/BeDispatchDispatchDeviceApi'
import DispatcherScheduleApi from '../../../api/module/beDispatch/BeDispatchDispatcherScheduleApi'
export default {
  name: 'DispatchRecording',
  mixins: [Mixins],
  data() {
    return {
      Headers: [
        { label: '序号', type: 'index' },
        { label: '任务编号', prop: 'id' },
        { label: '任务类型', prop: 'taskTypeName' },
        { label: '航班编号', prop: 'flightNo' },
        { label: '旅客姓名', prop: 'passengerName' },
        { label: '备注', prop: 'notes' },
        { label: '服务人员', prop: 'assignAttendant' },
        { label: '分配手持', prop: 'assignHandsetName' },
        { label: '分配时间', prop: 'createTime' },
        { label: '接收时间', prop: 'rogerTime' },
        { label: '完成时间', prop: 'accomplishTime' },
        { label: '状态', prop: 'status', format: {
          0: '待接收',
          1: '已接收',
          2: '已完成',
          3: '已取消',
          4: '已删除',
          5: '其他'
        }}
      ],
      ApiObject,
      queryParams: {
        task_date: '',
        createTime: '',
        assignHandsetId: '',
        taskType: '',
        assignAttendant: '',
        status: ''
      },
      taskTypeOptions: [],
      dispatchDeviceOptions: [],
      dispatcherScheduleApiOptions: []
    }
  },
  methods: {
    async initTaskTypeOptions() {
      this.taskTypeOptions = await DatadictApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.DISPATER_TYPE)
    },
    async initDeviceOptions() {
      this.dispatchDeviceOptions = await DispatchDeviceApi.getOptions()
    },
    async initDispatcherScheduleApiOptions() {
      this.dispatcherScheduleApiOptions = await DispatcherScheduleApi.getOptions()
    },
    createdAspectBefore() {
      // this.queryParams.task_date = this.$moment().format('YYYY-MM-DD')
      this.initTaskTypeOptions()
      this.initDeviceOptions()
      this.initDispatcherScheduleApiOptions()
    },
    uploadSuccess(response, file, fileList) {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
