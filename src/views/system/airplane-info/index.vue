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
          <el-form-item>
            <company-select v-model="queryParams.airline" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
      <template slot="layout-operate">
        <base-upload
          :action="`${ApiObject.BASEURL}/import`"
          accept=".xls,.xlsx"
          :show-file-list="false"
          @success="uploadSuccess"
        >
          <el-button type="primary">
            导入excel表
          </el-button>
        </base-upload>
      </template>
    </base-table-layout>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeAircraftApi'
import AirlineApi from '@/api/module/beTrade/BeTradeAirlineApi'
import BaseUpload from '../../../components/upload/BaseUpload'
import AirlineSelect from '../../common/select/AirlineSelect'
import CompanySelect from "../../common/select/CompanySelect";
export default {
  name: 'AirplaneInfo',
  components: {CompanySelect, AirlineSelect, BaseUpload },
  mixins: [Mixins],
  props: {},
  data() {
    return {
      ApiObject,
      dialogFormRules: {},
      DialogForm: {
      },
      Headers: [
        // { label: '序号', type: 'index' },
        { label: '机号', prop: 'code' },
        { label: '机型', prop: 'model' },
        { label: '最大起飞重量', prop: 'mtow' },
        { label: '业载', prop: 'payload' },
        { label: '最大座位', prop: 'seatCount' },
        { label: '宽/窄体', prop: 'widthType' },
        { label: '飞机属性', prop: 'useType' },
        { label: '航空公司代码', prop: 'airlineCode' },
        { label: '航空公司', prop: 'airline' }
        // { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        airline: ''
      },
      airlineOptions: []
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.init()
    },
    async createdAspectBefore() {
      this.airlineOptions = await AirlineApi.getOptions()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
