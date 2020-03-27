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
          <base-upload
            accept=".xls,.xlsx"
            :action="`${ApiObject.BASEURL}/qs/import`"
            :show-file-list="false"
            :before-upload="beforeUpload"
            @success="uploadSuccess"
          >
            <el-button type="primary">
              上传
            </el-button>
          </base-upload>
        </base-form>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeReportApi'
export default {
  name: 'FlightCompanyLiquidation',
  mixins: [Mixins],
  data() {
    return {
      Mixins_Pagination: false,
      ApiObject,
      Headers: [
        { label: '序号', type: 'index' },
        { label: '航空公司名称', prop: 'airline' },
        { label: '头等舱旅客服务', prop: 'tdclk' },
        { label: '持卡旅客服务', prop: 'cklv' },
        { label: '贵宾旅客服务', prop: 'gblk' },
        { label: '国内贵宾(重要旅客)服务', prop: 'gngb' },
        { label: '国内头等舱、公务舱旅客服务', prop: 'gntdc' },
        { label: '重要旅客服务', prop: 'zylk' },
        { label: '头等舱旅客随行服务费', prop: 'tdcsxlk' },
        { label: '重要旅客随行服务费', prop: 'zylksx' },
        { label: '持卡旅客随行服务费', prop: 'cklksx' }
      ],
      queryParams: {
        airline: ''
      }
    }
  },
  computed: {
    listApi() { return this.ApiObject.configList }
  },
  methods: {
    uploadSuccess() {
      this.$message.success('数据导入成功')
      this.init()
    },
    async beforeUpload(file) {
      try {
        await this.$confirm('上传的文件将覆盖原数据!')
        return true
      } catch (e) {
        return false
      }
    },
    editAfter() {
      this.dialogForm.list = this.dialogForm.list.map(item => item.id)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
