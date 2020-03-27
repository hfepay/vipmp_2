<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      :pagination="Mixins_Pagination"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item label="航班号：">
            <el-input v-model="queryParams.flightCode" placeholder="航班号" />
          </el-form-item>
          <el-form-item label="时间：">
            <base-date-picker
              v-model="queryParams.date"
            />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeFlightRecordApi'
export default {
  name: 'FlightRecords',
  mixins: [Mixins],
  data() {
    return {
      ApiObject: ApiObject,
      pagination: false,
      headers: [
        { label: '序号', type: 'index' },
        { label: '航班号', prop: 'flightCode' },
        { label: '出港状态', prop: 'departStatusCn' },
        { label: '进港状态', prop: 'arrivalStatusCn' },
        { label: '时间', prop: 'createTime' },
      ],
      queryParams: {
        flightCode: '',
        date: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
