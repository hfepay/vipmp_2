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
            <airline-select v-model="queryParams.airline" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.status" filterable placeholder="请选择合同状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.contractStatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <base-date-picker
              v-model="queryParams.timeRange"
              start-placeholder="合同开始时间"
              end-placeholder="合同开始时间"
              type="daterange"
            />
          </el-form-item>
          <el-form-item>
            <base-date-picker
              v-model="queryParams.closeTimeRange"
              start-placeholder="合同到期时间"
              end-placeholder="合同到期时间"
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
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <template slot="chargeStandard" slot-scope="{scope}">
        <details>
          <summary>查看详情</summary>
          {{ scope.row.chargeStandard }}
        </details>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="edit(scope.row)">
          修改
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>

    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="1400px"
      center
      @closed="reset"
    >
      <base-form
        ref="form"
        :model="DialogForm"
        confirm-btn-text="保存"
        :rules="dialogFormRules"
        label-width="150px"
        @submit="Mixins_$Submit"
        @cancel="Mixins_$DialogVisible = false"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同名称：" prop="name">
              <el-input v-model="dialogForm.name" placeholder="合同名称" :maxlength="50" style="width: 350px" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="航司名称：" prop="airline">
              <airline-select v-model="dialogForm.airline" @getObj="initAirLineCode" />
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="承租方名称：" prop="lesseeName">
              <el-input v-model="dialogForm.lesseeName" placeholder="承租方名称" :maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同有效期：" prop="timeRange">
              <el-date-picker
                v-model="dialogForm.timeRange"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="dialogForm.remarks" :maxlength="50" placeholder="备注" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="结算方式：" prop="settlementType">
              <el-input v-model="dialogForm.settlementType" :maxlength="20" placeholder="结算方式" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-table
                :data="dialogForm.airlinePassenger"
                border
                style="width: 100%"
              >
                <el-table-column prop="datadictName" label="结算类型">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.datadictName" :maxlength="20" :disabled="true" />
                  </template>
                </el-table-column>
                <el-table-column prop="priceSelf" label="本人(价格)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.priceSelf" type="number" />
                  </template>
                </el-table-column>
                <el-table-column prop="priceFollower" label="随行(价格)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.priceFollower" type="number" />
                  </template>
                </el-table-column>
                <el-table-column prop="followerCnt" label="随行人数">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.followerCnt" clearable filterable placeholder="请选择人数">
                      <el-option
                        v-for="(item, $index) in $Contants.toOptions($Contants.followerCount)"
                        :key="$index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="是否自动顺延：">
            <el-switch
              v-model="dialogForm.autoDelay"
              style="display: inline-block"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="是否清算：">
            <el-switch
              v-model="dialogForm.liquidation"
              style="display: inline-block"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>

          <el-col :span="24">
            <el-form-item label="合同扫描件上传：">
              <base-upload
                v-model="dialogForm.imgName"
                list-type="picture-card"
                :file-list="fileList"
              >
                <i class="el-icon-plus" />
              </base-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="dialogForm['id']" slot="btn-after">
          <el-button type="primary" @click="submitDelay">
            延期
          </el-button>
        </template>
      </base-form>
    </base-dialog>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import AirlineApi from '@/api/module/beTrade/BeTradeAirlineApi'
import ApiObject from '../../../api/module/beTrade/BeTradeAirlineContractApi'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import BaseUpload from '../../../components/upload/BaseUpload'
import AirlineSelect from '../../common/select/AirlineSelect'

export default {
  name: 'AirlineContract',
  components: { BaseUpload, AirlineSelect },
  mixins: [Mixins],
  data() {
    return {
      timeRangeToCamelCase: true,
      dialogFormRules: {
        name: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        airline: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        lesseeName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        timeRange: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        remarks: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        settlementType: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      ApiObject: ApiObject,
      airlineOptions: [], // 航空公司下拉框
      autoDelay: true,
      queryParams: {
        status: '1',
        airline: ''
      },
      fileList: [],
      dialogForm: {
        name: '',
        airCodeThree: '',
        airline: '',
        lesseeName: '',
        settlementType: '',
        remarks: '',
        autoDelay: 0,
        liquidation: 0,
        timeRange: [],
        closeTimeRange: [],
        airlinePassenger: [],
        imgName: []
      },

      headers: [
        { label: '序号', type: 'index' },
        { label: '航司名称', prop: 'airlineName' },
        { label: '备注', prop: 'remarks' },
        { label: '承租方名称(合同)', prop: 'lesseeName' },
        // { label: '航司三字码', prop: 'airline' },
        { label: '合同名称', prop: 'name' },
        { label: '合同有效期', prop: 'effectiveDate' },
        { label: '结算方式', prop: 'settlementType' },
        { label: '收费标准', prop: 'chargeStandard', slot: 'chargeStandard' },
        { label: '操作', slot: 'operator', width: 160 }
      ]
    }
  },
  methods: {
    initAirLineCode(data) {
      this.dialogForm.airCodeThree = data.airCodeThree
    },
    resetAfter() {
      this.fileList = []
    },
    async submitDelay() {
      await this.$confirm('是否确认当前合同，确认后，合同名称+1，合同有效期年份+1?', '延期')
      const data = { ...this.dialogForm }
      data.startTime = this.dialogForm.timeRange[0]
      data.endTime = this.dialogForm.timeRange[1]
      delete data.timeRange
      const data2 = await ApiObject.delay(data)
      if (data2.code == 1) {
        this.Mixins_$DialogVisible = false
      }
    },
    async createdAspectBefore() {
      this.initAirlineOptions()
    },
    async initAirlineOptions() {
      this.airlineOptions = await AirlineApi.getOptions()
    },
    getFinalQueryParams(dialogForm) {
      if (dialogForm.closeTimeRange) {
        dialogForm.startCloseTime = dialogForm.closeTimeRange[0]
        dialogForm.endCloseTime = dialogForm.closeTimeRange[1]
      }
      delete dialogForm.closeTimeRange
      return dialogForm
    },
    getDialogFormParams() {
      const data = { ...this.dialogForm }
      data.startTime = this.dialogForm.timeRange[0]
      data.endTime = this.dialogForm.timeRange[1]
      delete data.timeRange
      !this.$utils.isArray(data.imgName) && (data.imgName = data.imgName.split(',').filter(item => item))
      return data
    },
    async addAfter() {
      const list = await SettlementApi.getOptionsAll(this.$Contants.DICTIONARY_ENUM.DATADUCT_ID)
      this.dialogForm.airlinePassenger = list.data.map(item => {
        return {
          datadictId: `${item.id}`,
          datadictName: item.selType,
          priceSelf: '',
          priceFollower: '',
          followerCnt: '0'
        }
      })
    },
    async editAfter(res) {
      const startTime = `${this.dialogForm.startTime}`
      const endTime = `${this.dialogForm.endTime} `
      // this.dialogForm.timeRange = [new Date(startTime), new Date(endTime)]
      this.$set(this.dialogForm, 'timeRange', [])
      this.$set(this.dialogForm.timeRange, 0, this.$moment(startTime).format('YYYY-MM-DD'))
      this.$set(this.dialogForm.timeRange, 1, this.$moment(endTime).format('YYYY-MM-DD'))
      this.fileList = this.dialogForm.imgName.map(item => {
        return {
          name: item,
          url: this.$utils.imgWrapper(item)
        }
      })
    }

  }

}

</script>

<style scoped>

</style>
