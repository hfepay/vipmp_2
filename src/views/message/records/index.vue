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
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
          <el-form-item label="发送时间：">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="queryParams.code" clearable placeholder="发送状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.messageCode)"
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
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beMisc/BeMiscSendLogApi'
export default {
  name: 'MessageRecords',
  mixins: [Mixins],
  data() {
    return {
      ApiObject: ApiObject,
      headers: [
        { label: '发送人', prop: 'creator' },
        { label: '发送内容', prop: 'content' },
        { label: '接收人', prop: 'addressName' },
        { label: '发送时间', prop: 'createTime' },
        { label: '发送状态', prop: 'errorMsg' }
      ],
      queryParams: {
        keyword: '',
        status: '',
        timeRange: [],
        code: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
