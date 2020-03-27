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
        <base-form
          :inline="true"
          :model="QueryParams"
          :show-default-foot="false"
        >
          <el-form-item>
            <el-input
              v-model="queryParams.name"
              placeholder="按旅客姓名查询"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryParams.flightNumber"
              placeholder="按航班号查询"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryParams.contactPhone"
              placeholder="按预约电话查询"
            />
          </el-form-item>
          <el-form-item>
            <reception-search-input
              v-model="queryParams.orderBy"
              placeholder="请选择接待人/单位"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryParams.orderStatus"
              clearable
              placeholder="按状态查询"
            >
              <el-option
                v-for="(item, $index) in $Contants.toOptions(
                  $Contants.reserveStatus
                )"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button @click="resetQueryParams">
            重置
          </el-button>
        </base-form>
      </template>
      <template slot="appointmentDate" slot-scope="{ scope }">
        {{ scope.row.appointmentDate }} {{ scope.row.appointmentStartTime }}-{{ scope.row.appointmentEndTime }}
      </template>
      <template slot="operator" slot-scope="{ scope }">
        <el-button type="primary" @click="showLogs(scope.row)">
          查看
        </el-button>
        <el-button type="primary" @click="send(scope.row)">
          发送短信
        </el-button>
      </template>
    </base-table-layout>
    <!--发送记录弹窗-->
    <base-dialog
      title="发送记录"
      :visible.sync="Mixins_$DialogVisible"
      width="900px"
      center
    >
      <base-table :headers="sendRecordsHeaders" :data="sendRecordsList" />
    </base-dialog>
    <!--发送短信弹窗-->
    <base-dialog
      title="发送短信"
      :visible.sync="sendMsgDialogVisible"
      width="900px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="120px"
        @submit="submitDialogForm"
        @cancel="sendMsgDialogVisible = false"
      >
        <el-form-item label="选择短信模板" prop="templateId">
          <el-select v-model="DialogForm.templateId" placeholder="选择短信模板">
            <el-option
              v-for="(item, $index) in templateOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通讯录" prop="addressBook">
          <el-checkbox-group v-model="DialogForm.addressBook">
            <el-checkbox
              v-for="(item, $index) in addressBookList"
              :key="$index"
              :label="item.item"
              name="addressBook"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="该服务单旅客：" prop="passenger">
          <el-checkbox-group v-model="DialogForm.passenger">
            <el-checkbox v-for="(item, $index) in passengerList" :key="$index" :label="item.value" name="passenger">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="模板内容">
          <template>
            {{ templateContent }}
          </template>
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeOrderApi'
import BeMiscSendLogApi from '@/api/module/beMisc/BeMiscSendLogApi'
import AddressBookApi from '../../../api/module/beMisc/BeMiscAddressBookApi'
import BeMiscTemplateApi from '@/api/module/beMisc/BeMiscTemplateApi'
import ReceptionSearchInput from '../../common/autocomplete/ReceptionSearchInput'
export default {
  name: 'SendMessage',
  components: { ReceptionSearchInput },
  mixins: [Mixins],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addressBookList: [],
      sendMsgDialogVisible: false, // 发送短信弹窗控制
      // 发送记录表头
      sendRecordsHeaders: [
        { label: '发送人', prop: 'creator' },
        { label: '发送内容', prop: 'content' },
        { label: '接收人', prop: 'addressName' },
        { label: '发送时间', prop: 'createTime' },
        { label: '发送状态', prop: 'errorMsg' }
      ],
      // 发送记录list
      sendRecordsList: [],
      templateOptions: [],
      ApiObject,
      BeMiscTemplateApi: BeMiscTemplateApi,
      BeMiscSendLogApi: BeMiscSendLogApi,
      dialogFormRules: {
        templateId: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
        // addressBook: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // passenger: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      passengerList: [],
      DialogForm: {
        templateId: '',
        passenger: [],
        addressBook: []
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '预约时间', prop: 'applyTime' },
        { label: '预约人/单位', prop: 'orderBy' },
        { label: '联系电话', prop: 'contactPhone' },
        { label: '旅客姓名', prop: 'name' },
        { label: '航班号', prop: 'flightCode' },
        { label: '预约人数', prop: 'people' },
        { label: '服务类型', prop: 'serviceType' },
        { label: '预约厅房', prop: 'bookingHall' },
        {
          label: '预约服务时间',
          prop: 'appointmentDate',
          slot: 'appointmentDate',
          width: '200'
        },
        { label: '备注', prop: 'remark' },
        { label: '状态',
          prop: 'orderStatus',
          format: {
            0: '新建',
            1: '已接待',
            2: '已取消'
          }
        },
        { label: '操作', slot: 'operator', width: 260 }
      ],
      queryParams: {
        other: 'b',
        passenger_name: '',
        flight_number: '',
        contact_phone: '',
        order_status: '',
        order_by: ''
      }
    }
  },
  computed: {
    templateContent() {
      const templateId = this.dialogForm.templateId
      const template = this.templateOptions.filter(
        item => item.value === templateId
      )[0]
      return template ? template.content : ''
    }
  },
  methods: {
    getFinalDialogFormParams(data) {
      data.orderId = data.id
      const passenger = data.passenger[0]
      if (passenger) {
        data.consumerName = passenger.passengerName
        data.phoneNum = passenger.contactPhone
      }
      delete data.id
      delete data.passenger
      return data
    },
    checkAddressBookAndPassenger() {
      const { addressBook, phoneNum } = this.getDialogFormParams()
      const result = addressBook.length > 0 || phoneNum
      !result && this.$message.error('通讯录和旅客至少选择一个')
      return result
    },
    async submitDialogForm() {
      if (!this.checkAddressBookAndPassenger()) {
        return
      }
      const res = await BeMiscSendLogApi.send(this.getDialogFormParams())
      this.$message.success(res.message)
      this.sendMsgDialogVisible = false
    },
    send(obj) {
      this.dialogForm = { ...this.dialogForm, ...obj }
      this.passengerList = [{ label: obj.contactPhone, value: obj }]
      this.sendMsgDialogVisible = true
    },
    async showLogs(obj) {
      const result = await this.BeMiscSendLogApi.showLogs(obj.id)
      // 打开弹窗
      this.dialogVisible = true
      this.sendRecordsList = result.data
    },
    createdAspectBefore() {
      this.initAddressBookList()
      this.selectAllTemplate()
    },
    async initAddressBookList() {
      this.addressBookList = await AddressBookApi.getOptions()
    },
    // 查询所有短信模板
    async selectAllTemplate() {
      this.templateOptions = await this.BeMiscTemplateApi.getOptions()
    }
  }
}
</script>
<style lang="scss" scoped></style>
