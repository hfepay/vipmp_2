<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :pagination="Mixins_Pagination"
      :headers="Headers"
      :data="Mixins_$TableData"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item label="查询日期：">
            <base-date-picker
              v-model="queryParams.createTime"
            />
          </el-form-item>
          <el-form-item label="航班号：">
            <el-input v-model="queryParams.flightCode" placeholder="航班号" />
          </el-form-item>
          <el-form-item label="厅房：">
            <hall-room-select ref="hall-select" v-model="queryParams.hallId" @getOptions="getHallOptions" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
      <template #context="{scope}">
        <!--eslint-disable-next-line-->
        <div v-html="scope.row.context" />
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/websocket/WebsocketMessageApi'
import HallRoomSelect from '../../common/select/HallRoomSelect'
export default {
  name: 'DialogLog',
  components: { HallRoomSelect },
  mixins: [Mixins],
  data() {
    return {
      headers: [
        { label: '序号', type: 'index' },
        // 根据下拉列表格式化
        { label: '厅房', prop: 'hallName' },
        { label: '弹窗时间', prop: 'createTime' },
        { label: '弹窗弹窗点击时间', prop: 'updateTime' },
        { label: '点击人', prop: 'updateByName' },
        { label: '标题', prop: 'title' },
        { label: '内容', prop: 'context', slot: 'context' },
        { label: 'ip', prop: 'remoteIp' }
      ],
      pagination: false,
      // 厅房名称前端格式化，第一次先加载厅房列表  再加载表格数据
      // 第一次厅房下拉是否加载完毕
      hallOptionsLoaded: false,
      // 第一次表格加载是否完毕
      tableDataLoaded: false,
      ApiObject: ApiObject,
      hallOptions: {},
      queryParams: {
        createTime: '',
        flightCode: '',
        hallId: ''
      }
    }
  },
  methods: {
    validateSearchParams() {
      return this.hallOptionsLoaded
    },
    getTableDataAspectAfter(data) {
      data.forEach(item => {
        this.$set(item, 'hallName', this.hallOptions[item.hallId])
      })
      this.tableDataLoaded = true
      return data
    },
    getHallOptions(options) {
      options.forEach(item => {
        this.hallOptions[item.value.toString()] = item.label
      })
      this.hallOptionsLoaded = true
      if (!this.tableDataLoaded) {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
