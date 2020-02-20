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
          <el-form-item>
            <el-date-picker
              v-model="queryParams.timeRange"
              value-format="yyyy-MM-dd"
              start-placeholder="请选择服务时间"
              end-placeholder="请选择服务时间"
              type="daterange"
            />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.name" placeholder="旅客姓名" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.flightNumber" placeholder="航班号" />
          </el-form-item>
          <template v-if="isCurrent">
            <el-form-item>
              <el-input v-model="queryParams.contactPhone" placeholder="预约电话" />
            </el-form-item>
          </template>
          <el-form-item v-if="!isDispatchCenterPage">
            <reception-search-input v-model="queryParams.orderBy" placeholder="请选择接待人/单位" style="width: 100%" />
          </el-form-item>
          <template v-if="isHistoryPage">
            <el-form-item>
              <el-select v-model="queryParams.orderStatus" clearable placeholder="预约状态">
                <el-option
                  v-for="(item, $index) in [{label:'已接待', value: '1'}, {label:'已取消', value: '2'}]"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <el-form-item>
            <base-date-picker
              v-model="queryParams.orderDate"
              placeholder="申请时间"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.orderChannel" clearable placeholder="预约渠道">
              <el-option
                v-for="(item, $index) in $globalContants.toOptions($globalContants.reserveChannel)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button
            type="primary"
            @click="exportExcel"
          >
            导出
          </el-button>
          <el-button @click="resetQueryParams">
            重置
          </el-button>
        </base-form>
      </template>
      <template v-if="!isHistoryPage" slot="top-right">
        <router-link to="/serverCenter/reserveHistory">
          <el-link type="primary" style="margin-right: 10px;line-height: 28px">
            预约历史记录
          </el-link>
        </router-link>
        <el-button v-if="!isDispatchCenterPage" type="primary" @click="add">
          新增
        </el-button>
      </template>
      <template slot="appointmentDate" slot-scope="{scope}">
        {{ scope.row.appointmentDate }} {{ scope.row.appointmentStartTime ? scope.row.appointmentStartTime + '-' + scope.row.appointmentEndTime : '' }}
      </template>
      <el-table-column v-if="isHistoryPage" label="操作" width="80">
        <el-button slot-scope="scope" @click.stop="show(scope.row)">
          查看
        </el-button>
      </el-table-column>
      <el-table-column v-else-if="isDispatchCenterPage" label="操作" width="100">
        <!--调度中心历史记录操作按钮-->
        <template slot-scope="scope">
          <el-button type="primary" @click="dispatch(scope.row)">
            分配作业
          </el-button>
        </template>
      </el-table-column>

      <el-table-column v-else label="操作" width="260">
        <!--本页操作按钮-->
        <!--操作-->
        <template slot-scope="scope">
          <el-button type="danger" @click="cancel(scope.row)">
            取消
          </el-button>
          <el-button @click.stop="edit(scope.row)">
            编辑
          </el-button>
          <el-button type="primary" @click="toRegistPage(scope.row)">
            接待登记
          </el-button>
        </template>
      </el-table-column>
    </base-table-layout>
    <update-dialog-text
      v-if="isHistoryPage"
      type="reserve-detail"
      :dialog-form="dialogForm"
      :dialog-visible="dialogVisible"
      @closed="handleClosed"
    />
    <reserve-update-dialog
      v-else
      v-model="dialogForm"
      :can-add-regist-data="canAddRegistData"
      :can-add-cabin-data="canAddCabinData"
      :customer-type-options="customerOptions"
      :hall-options="hallOptions"
      :dialog-visible="dialogVisible"
      @submit="submit"
      @closed="handleClosed"
    />
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeOrderApi'
import ReceiveOrgApi from '@/api/module/beTrade/BeTradeReceiveOrgApi'
import DictionaryApi from '@/api/module/beTrade/BeTradeDatadictApi'
import HallApi from '@/api/module/beTrade/BeTradeHallApi'
import ReceptionApi from '../../../api/module/beTrade/BeTradeReceptionApi'
import { validatePhoneOrNull, validateTwoFloat } from '../../../utils/validate/validate-element'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import ReceptionSearchInput from '../../common/autocomplete/ReceptionSearchInput'
import DispatcherScheduleApi from '../../../api/module/beDispatch/BeDispatchDispatcherScheduleApi'
import ReserveUpdateDialog from '../common/ReserveUpdateDialog'
import UpdateDialogText from '../common/UpdateDialogText'
import Bus from '../../Bus'
export default {
  name: 'Reserve',
  components: { UpdateDialogText, ReceptionSearchInput, ReserveUpdateDialog },
  mixins: [Mixins],
  props: {
    type: {
      type: String,
      default: 'current'
    }
  },
  data() {
    return {
      canAddCabinData: false,
      canAddRegistData: false,
      timeRangeToCamelCase: true,
      customerType: {},
      accompanyMaxNum: 0,
      dialogFormExtend: {
        info: ''
      },
      baseHeaders: [
        { label: '序号', type: 'index' },
        { label: '预约人/单位', prop: 'orderBy' },
        { label: '旅客姓名', prop: 'name' },
        { label: '航班号', prop: 'flightCode' },
        { label: '接待单位', prop: 'companyName' },
        { label: '预约服务时间', prop: 'appointmentDate', slot: 'appointmentDate', width: '150' },
        { label: '预计到达/起飞时间', prop: 'scheduleTime' },
        { label: '随行人数', prop: 'accompanyPeople' },
        { label: '服务类型', prop: 'serviceType' },
        { label: '客户类型', prop: 'customerTypeCN' },
        { label: '预约厅房', prop: 'bookingHall' },
        { label: '签单人', prop: 'signer' },
        { label: '备注', prop: 'content' },
        { label: '接机牌迎接语', prop: 'greeting' },
        { label: '状态', prop: 'orderStatus', format: this.$globalContants.reserveStatus }
        // { label: '联系电话', prop: 'contactPhone' },
        // { label: '申请时间', prop: 'applyTime' },
        // { label: '服务人员', prop: 'waiterName' },
        // { label: '预约渠道', prop: 'orderChannel', format: this.$globalContants.reserveChannel },
        // { label: '操作', slot: 'operator' }
      ],
      ApiObject,
      dialogFormRules: {
        appointmentDate: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // timeRange: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        name: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        mobile: [{ trigger: 'change', validator: validatePhoneOrNull }],
        // flightNumber: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        people: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // bookingHall: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        settlementAmount: [{ required: true, message: '金额最多保留两位有效数字', trigger: 'change', validator: validateTwoFloat }],
        applyTime: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // departureArrival: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // licensePlateNumber: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        accompanyPeople: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // receptionUnit: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        orderBy: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        ensuranceType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        settlementType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // cardNumber: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        appointmentPeriod: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serviceType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        contactPhone: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        passengerType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        orderStatus: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        'id': '',
        'jumpFlag': '',
        'status': '',
        'description': '',
        'createBy': '',
        'createTime': '',
        'updateBy': '',
        'updateTime': '',
        'name': '',
        'mobile': '',
        'flightCode': '',
        'airline': '',
        'aircraftCode': '',
        'people': '',
        'hallId': '',
        'amount': '',
        'remark': '',
        'content': '',
        'applyTime': '',
        serveNum: 0, //  服务人数
        otherServeNum: 0, //  其他服务人数
        allNum: 0, //  总人数
        'startCity': '',
        'otherServiceTypeId': '',
        'licensePlateNumber': '',
        'accompanyPeople': '',
        'companyId': '',
        'companyName': '',
        'orderBy': '',
        'ensuranceType': '',
        'settlementType': '',
        'settlementTypeId': '',
        'settlementCardNum': '',
        'appointmentDate': '',
        'appointmentStartTime': '',
        'appointmentEndTime': '',
        'serviceTypeId': '',
        'contactPhone': '',
        'passengerType': '',
        'orderStatus': '',
        'orderNumber': '',
        'jobIf': '',
        'waiterId': '',
        'startTime': '',
        'endTime': '',
        'signer': '',
        'accompanyList': [],
        'mainId': '',
        'isAccompany': '',
        'boardingPassNum': '',
        'idCard': '',
        'ticketNo': '',
        'cabinLevel': '',
        'seatNum': '',
        'greeting': '',
        'orderAmount': '',
        'orderChannel': ''
      },
      queryParams: {
        orderChannel: '',
        name: '',
        flightNumber: '',
        contactPhone: '',
        orderDate: '',
        orderStatus: '',
        orderBy: ''
      },
      waiterOptions: [],
      receiveOptions: [],
      customerOptions: [],
      hallOptions: [],
      settlementTypeOptions: [],
      serviceTypeOptions: []
    }
  },
  computed: {
    // 客户类型是否为航司用户
    isFlightCompany() {
      return this.customerType.label === '航司客户'
    },
    maxNum() {
      // 客户类型是为航司用户才限制人数
      return this.isFlightCompany ? this.accompanyMaxNum : Infinity
    },
    canAddAccompany() {
      return this.maxNum == -1 || (this.dialogForm.accompanyList || []).length < this.maxNum
    },
    headers() {
      return this.isDispatchCenterPage ? this.dispatchCenterHeaders : this.getHeaders
    },
    getHeaders() {
      if (this.isHistoryPage) {
        return this.baseHeaders.filter(item => item.prop !== 'scheduleTime')
      }
      return this.baseHeaders
    },
    dispatchCenterHeaders() {
      const leftArr = this.baseHeaders.slice(0, 1)
      const centerArr = [{ label: '订单编号', prop: 'orderNumber' }]
      const rightArr = this.baseHeaders.slice(1, this.baseHeaders.length - 1)
      return [...leftArr, ...centerArr, ...rightArr]
    },
    waiterIdInWaiterOptions() {
      return this.waiterOptions.find(item => item.value === this.dialogForm.waiterId)
    },
    hallIdInHallOptions() {
      return this.hallOptions.find(item => item.value === this.dialogForm.bookingHall)
    },
    isBusinessTravel() {
      return this.getPassengerTypeName() === '商旅客户'
    },
    isPPCard() {
      return this.getPassengerTypeName() === 'PP卡'
    },
    isCurrent() {
      return this.type === 'current'
    },
    isHistoryPage() {
      return this.type === 'history'
    },
    isDispatchCenterPage() {
      return this.type === 'dispatch-center'
    },
    suggestions() {
      return this.receiveOptions.map(item => {
        return {
          value: item.label
        }
      })
    }
  },
  methods: {
    exportExcel() {
      this.isHistoryPage ? this.ApiObject.exportHistoryExcel(this.getQueryParams()) : this.ApiObject.export(this.getQueryParams())
    },
    addBefore() {
      if (this.canAddRegistData) {
        this.dialogForm.jumpFlag = 1
      } else {
        this.dialogForm.jumpFlag = 0
      }
    },
    submitBeforeValidator() {
      let flag = true
      // 校验随行人员
      const accompanyList = this.dialogForm.accompanyList
      accompanyList.forEach(item => {
        // 过滤出所需字段
        // item = this.$utils.pick(item, ['boardingPassNum', 'name', 'cabinLevel', 'seatNum'])
        item = this.$utils.pick(item, ['name'])
        console.log('this.item' + this.item)
        const result = Object.values(item).every(Boolean)
        flag = flag && result
      })
      if (!flag) {
        this.$message.error('请输入随行人员姓名！')
      }
      return flag
    },
    handleClosed() {
      this.dialogVisible = false
      this.reset()
    },
    delAccompany(index) {
      this.dialogForm.accompanyList.splice(index, 1)
      this.calcSettleMoney()
    },
    addAccompany(data) {
      const baseData = {
        name: '', // 姓名
        idCard: '', // 身份证
        boardingPassNum: '', // 随行登机牌号
        flightCode: '', // 航班号
        cabinLevel: '', // 舱位
        seatNum: '' // 座位号
      }
      this.dialogForm.accompanyList.push({ ...baseData, ...data })
      this.calcSettleMoney()
    },
    toRegistPage(obj) {
      /* if (!obj.bookingHall && !['专人接机', '专车接机'].includes(obj.serviceType)) {
        this.$message.error('请先选择厅房')
        return
      }*/
      // jumpFlag: 0两舱  1接待
      this.$router.push(`/serverCenter/${obj.jumpFlag == 0 ? 'cabin' : 'regist'}?reserveId=${obj.id}`)
    },
    getQueryRespData(data) {
      return { ...data, type: data.jumpFlag == 0 ? 1 : 2 }
    },
    async initWaiterOptions() {
      const currentFormHall = this.hallOptions.filter(item => item.value == this.dialogForm.bookingHall)[0]
      if (this.dialogForm.bookingHall && currentFormHall) {
        this.waiterOptions = await DispatcherScheduleApi.getOptions(currentFormHall.label)
        if (!this.waiterOptions.filter(item => item.value === this.dialogForm.waiterId)[0]) {
          this.dialogForm.waiterId = ''
        }
      } else {
        this.waiterOptions = []
      }
    },
    async calcSettleMoney() { // 计算结算金额
      // && this.dialogForm.bookingHall
      if (this.dialogForm.settlementType) {
        const data = this.getCalcSettleMoneyData()
        const res = await ReceptionApi.getAmount(data)
        this.dialogForm.settlementAmount = res.data
      }
    },
    // 获取客户类型中文
    getPassengerTypeName() {
      const id = this.dialogForm.passengerType
      const result = this.customerOptions.filter(item => item.value == id)[0]
      return result ? result.label : ''
    },
    async initSettlementOptions() {
      this.settlementTypeOptions = this.dialogForm.passengerType ? await SettlementApi.getOptions(this.dialogForm.passengerType) : []
    },
    dispatch(obj) {
      this.$emit('dispatch', obj)
    },
    getFinalQueryParams(data) {
      data = { ...data }
      if (this.isDispatchCenterPage) {
        data.other = 'a'
      }
      return data
    },
    getFinalDialogFormParams(data) {
      if (this.dialogForm.timeRange && this.dialogForm.timeRange.length > 0) {
        data.appointmentStartTime = this.dialogForm.timeRange[0]
        data.appointmentEndTime = this.dialogForm.timeRange[1]
      } else {
        data.appointmentStartTime = ''
        data.appointmentEndTime = ''
      }
      delete data.timeRange
      return data
    },
    resetAfter() {
      this.dialogForm.timeRange = ''
      this.dialogForm.people = '1'
      this.dialogForm.accompanyPeople = '0'
      this.dialogForm.settlementAmount = '0.00'
    },
    async cancel(obj) {
      if (obj.orderChannel == this.$globalContants.RESERVECHANNEL_ENUM.WECHAT) {
        await this.$confirm('微信小程序预约的订单，请在微信中心-订单管理进行退款', '', {
          showCancelButton: false,
          center: true
        })
        return
      }
      await this.$confirm('您确定取消该预约单吗?', '取消')
      const result = await this.ApiObject.del(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    editAfter() {
      this.$set(this.dialogForm, 'timeRange', [])
      if (this.dialogForm.appointmentStartTime && this.dialogForm.appointmentEndTime) {
        const startTime = `${this.dialogForm.appointmentStartTime}`
        const endTime = `${this.dialogForm.appointmentEndTime}`
        this.$set(this.dialogForm.timeRange, 0, startTime)
        this.$set(this.dialogForm.timeRange, 1, endTime)
      }
    },
    createdAspectBefore() {
      this.initReceiveOptions()
      this.initCustomerOptions()
      this.initServiceTypeOptions()
      this.initCanAddRegistData()
      this.initCanCabinData()
      Bus.$on('init', _ => {
        this.init()
      })
      // this.initHallOptions()
    },
    async initCanCabinData() {
      const res = await HallApi.cabinHallList()
      this.canAddCabinData = res.length > 0
    },
    async initCanAddRegistData() {
      const res = await HallApi.otherHallList()
      this.canAddRegistData = res.length > 0
    },
    async initReceiveOptions() {
      this.receiveOptions = await ReceiveOrgApi.getOptions()
    },
    async initCustomerOptions() {
      this.customerOptions = await DictionaryApi.getOptionsByType(this.$globalContants.DICTIONARY_ENUM.CUSTOMER_TYPE)
    },
    async initServiceTypeOptions() {
      this.serviceTypeOptions = await DictionaryApi.getOptionsByType(this.$globalContants.DICTIONARY_ENUM.SERVER_TYPE)
    },
    async initHallOptions() {
      this.hallOptions = await HallApi.getOptionsByDatadictId(this.dialogForm.serviceType)
      return true
    },
    async getTableData() {
      const result = this.isHistoryPage ? await this.ApiObject.hisoryPage(this.getQueryParams()) : await this.ApiObject.page(this.getQueryParams())
      this.tableData = this.pagination ? result.data.records : result.data
      this.pageObj.total = this.pagination ? ~~result.data.total : 0
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-form-title{
    font-size: 18px;
    font-weight: bold;
  }
</style>
