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
          <el-form-item label="用户ID：">
            <el-input v-model="queryParams.userId" placeholder="按用户ID查询" />
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="queryParams.mobileNumber" placeholder="按手机号查询" />
          </el-form-item>
          <el-form-item label="注册时间：">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beAccount/BeAccountUserApi'
export default {
  name: 'WechatAccount',
  mixins: [Mixins],
  data() {
    return {
      timeRangeToCamelCase: true,
      ApiObject,
      Headers: [
        { label: '用户ID', prop: 'userId' },
        // { label: '微信ID', prop: 'wechatId' },
        // { label: '昵称', prop: 'nickName' },
        { label: '手机号', prop: 'mobileNumber' },
        { label: '注册时间', prop: 'registerTime' }
      ],
      queryParams: {
        userId: '',
        mobileNumber: '',
        timeRange: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
