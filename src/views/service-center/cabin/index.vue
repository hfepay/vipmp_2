<template>
  <div v-loading="loading" class="hf-container">
    <!--table模板-->
    <base-table-layout
      row-key="id"
      :page-obj="pageObj"
      :headers="getHeaders"
      :data="tableData"
      :pagination="pagination"
      :row-class-name="tableRowClassName"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @selection-change="handleSelectionChange"
    >
      <template slot="top-left">
        <base-form :inline="true" :model="queryParams" :show-default-foot="false">
          <el-form-item label="当前厅室：">
            <el-select
              v-model="queryParams.hall_id"
              style="width: 100%"
              clearable
              placeholder="按服务厅房查询"
            >
              <el-option
                v-for="(item, $index) in hallOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <slot>
            <el-form-item v-if="type === 'regist'">
              <el-input v-model="queryParams.name" placeholder="按旅客姓名查询" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="queryParams.customer_type_id" style="width: 100%" clearable placeholder="按客户类型查询">
                <el-option
                  v-for="(item, $index) in customerTypeOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!isRegist">
              <div style="color: orangered;border:1px solid orangered;padding: 0 20px;height: 28px;border-radius: 4px;line-height: 28px">
                当前VIP人数：{{ vipNum }}
              </div>
            </el-form-item>
          </slot>
          <el-form-item>
            <el-input v-model="queryParams.flight_code" placeholder="按航班查询" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.airline" placeholder="按航空公司查询" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.aircraftCode" placeholder="按机号查询" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.settlementCardNum" placeholder="按卡号查询" />
          </el-form-item>
          <el-form-item v-if="isRegist">
            <base-date-picker
              v-model="queryParams.serveDate"
              placeholder="接待日期"
            />
          </el-form-item>
          <el-form-item v-else>
            <el-input
              v-model="queryParams.boardingPassNum"
              placeholder="登机牌"
            />
          </el-form-item>
          <el-form-item v-if="isRegist">
            <el-checkbox v-model="queryParams.status" true-label="1" @change="search">
              显示已完成订单
            </el-checkbox>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button @click="resetQueryParams">
            重置
          </el-button>
          <el-button v-if="isRegist" type="warning" @click="printRecepits()">
            打印收费单
          </el-button>
        </base-form>
      </template>
      <template slot="top-right">
        <el-input ref="scan-code-info-input" v-model="scanCodeInfo" placeholder="请扫码登记旅客" @focus="changeInputtingMethod" @input="scanCodeRegistration" />
        <el-button type="primary" @click="add">
          新增
        </el-button>
      </template>

      <template slot="status" slot-scope="{scope}">
        {{ scope.row.status | serviceStatusFilter }}
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <template v-if="!isRegist">
          <el-button v-if="scope.row.status != '1'" @click="handleLeave(scope.row)">
            离舱
          </el-button>
          <el-button @click="printRelaxCard(scope.row)">
            打印休息卡
          </el-button>
        </template>
        <!--接待登记 没有厅房显示服务结束按钮-->
        <el-button v-else-if="scope.row.status != 1 && isJJService(scope.row.serviceName)" @click="finishServe(scope.row)">
          服务结束
        </el-button>

        <el-button type="primary" @click.stop="edit(scope.row)">
          编辑
        </el-button>
        <!--<el-button type="danger" @click.stop="del(scope.row)" v-if="roles.includes('记录删除')">
          删除
        </el-button>-->
        <!--主卡才有操作按钮-->
        <template v-if="scope.row.isAccompany == 0">
          <el-button v-if="isRegist" type="warning" @click="$parent.dispatch(scope.row)">
            调度
          </el-button>
        </template>
      </template>
    </base-table-layout>
    <update-dialog
      v-model="dialogForm"
      :page="type"
      :customer-type-options="customerTypeOptions"
      :hall-options="hallOptions"
      :dialog-visible="dialogVisible"
      @submit="submit"
      @closed="handleClosed"
    />
    <!--推送提示信息-->
    <div class="push-prompt-container">
      <el-card v-for="(item,$index) in pushInfoList" :key="$index" class="push-prompt-card">
        <div slot="header" class="clearfix">
          <span>{{ item.title }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="delPushInfo(item,$index)">
            确定
          </el-button>
        </div>
        <div class="push-prompt-name" v-html="item.context " />
        <div>
          {{ item.number }}通知时间:{{ item.createTimeStr }}
        </div>
      </el-card>
    </div>
    <!--自费收据样板：-->
    <div ref="self-pay-receipt" class="print-container">
      <receipt v-for="(form,$index) in receiptPrintData" :key="$index" :dialog-form="form" class="print-full-page" />
    </div>
    <div ref="relax-card" class="print-container">
      <relax-card :dialog-form="dialogForm" />
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { Mixins } from '@/mixins/mixins'
import ArrayUtils from '../../../utils/ArrayUtils'
import ApiObject from '../../../api/module/beTrade/BeTradeCabinApi'
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import ReceiveOrgApi from '../../../api/module/beTrade/BeTradeReceiveOrgApi'
import WebsocketApi from '../../../api/module/socket/SocketWebsocketApi'
import ProductOrderApi from '../../../api/module/wechat/WechatProductOrderApi'
import OrderApi from '../../../api/module/beTrade/BeTradeOrderApi'
import DispatcherScheduleApi from '../../../api/module/beDispatch/BeDispatchDispatcherScheduleApi'
import UpdateDialog from '../common/UpdateDialog'
import MyWebSocket from '../../../utils/websocket'
import Receipt from '../common/Receipt'
import RelaxCard from '../common/RelaxCard'
import Bus from '../../Bus'
import { mapGetters } from 'vuex'
export default {
  name: 'CabinList',
  components: { UpdateDialog, Receipt, RelaxCard },
  mixins: [Mixins],
  props: {
    type: {
      type: String,
      default: 'cabin'
    },
    apiObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      retryCount: 0, // 重试计数
      maxRetry: 3, // 最大重连次数
      websocketMsgScheduled: null,
      multipleSelection: [],
      polling: true,
      scanCodeRegistrationTimer: null, // 扫码登记定时器
      pagination: false,
      scanCodeInfo: '', // 扫码信息
      tryTime: 0, // websocket重试连接次数
      settlementOptions: [], // 结算类型下拉框
      customerTypeOptions: [], // 客户类型下拉框
      receptUnitOptions: [], // 接待单位下拉框
      hallOptions: [], // 厅室下拉框
      payTypeOptions: [], // 支付类型下拉框
      serviceTypeOptions: [], // 服务类型下拉框
      pushInfoList: [],
      queryParams: {
        hall_id: '',
        customer_type_id: '',
        name: '',
        flight_code: '',
        airline: '',
        aircraftCode: '',
        boardingPassNum: '',
        settlementCardNum: ''
      },
      websock: null, // 服务过期提醒
      vipNum: 0,
      maxNum: 3,
      ApiObject: this.apiObj || ApiObject,
      selectList: [],
      receiptForm: {
        list: []
      },
      dialogForm: {
        deliverDepartureGate: '',
        airline: '',
        job: '',
        ticketNo: '',
        serveDate: '',
        signer: '',
        companyId: '', // 接待单位
        serviceTypeId: '', // 服务类型id
        otherServiceTypeId: '', // 其他服务类型id
        name: '', // 贵宾姓名,
        mobile: '', //  手机号码
        serveNum: 0, //  服务人数
        otherServeNum: 0, //  其他服务人数
        allNum: 0, //  总人数
        boardingPassNum: '', //  登记牌号
        flightCode: '', //  航班号
        cabinLevel: '', //  座舱级别
        aircraftCode: '', //  机号
        seatNum: '', //  座位号
        startCity: '', //  出发城市
        customerTypeId: '', //  顾客类型id
        settlementTypeId: '', //  结算类型id
        settlementCardNum: '', //  结算卡卡号
        hallId: '', //  厅室id
        amount: '', //  消费金额
        waiterId: '', //  服务员id
        duration: '', //  时长
        accompanyCount: '', //  随同人员数量
        accompanyList: [] //  随同人员
      },
      waiterOptions: [],
      dialogFormExtend: {
        info: '' // 随行人员信息,
      },
      cabinHeaders: [
        { type: 'index', label: '序号' },
        { label: '航班', prop: 'flightCode' },
        { label: '姓名', prop: 'name' },
        { label: '舱位', prop: 'cabinLevel' },
        { label: '座位号', prop: 'seatNum' },
        { label: '机号', prop: 'aircraftCode' },
        { label: '航空公司', prop: 'airline' },
        { label: '预计起飞时间', prop: 'takeOffTime' },
        { label: '航班状态', prop: 'flightStatus' },
        { label: '登机口', prop: 'loadingPort' },
        { label: '随行', prop: 'accompanyCount' },
        { label: '手机号码', prop: 'mobile' },
        { label: '结算类型', prop: 'settlementType' },
        { label: '卡号', prop: 'settlementCardNum' },
        { label: '备注', prop: 'remarks' },
        { label: '服务人员', prop: 'waiter' },
        { label: '接待时间', prop: 'serveDate' },
        { label: '操作', slot: 'operator', width: 220 }
      ],
      registHeaders: [
        { label: '序号', type: 'selection', reserveSelection: true, selectable: (row, index) => {
          const exceptTypes = ['航司客户', '商旅客户']
          return !exceptTypes.includes(row.customerTypeName)
        } },
        { label: '服务单号', prop: 'serviceNum' },
        { label: '接待时间', prop: 'serveDate' },
        { label: '客户类型', prop: 'customerTypeName' },
        { label: '接待单位', prop: 'companyName' },
        { label: '航班', prop: 'flightCode' },
        { label: '旅客姓名', prop: 'name' },
        { label: '随行人数', prop: 'accompanyCount' },
        { label: '结算类型', prop: 'settlementTypeName' },
        { label: '卡号', prop: 'settlementCardNum' },
        { label: '服务类型', prop: 'serviceName' },
        { label: '服务厅房', prop: 'roomName' },
        { label: '状态', prop: 'status', slot: 'status' },
        { label: '操作', slot: 'operator', width: 220 }
      ]
    }
  },
  computed: {
    ...mapGetters(['roles']),
    finalPushInfoList() {
      const result = []
      this.pushInfoList.forEach(item => {
        if (!result.map(item => item.id).includes(item.id)) {
          result.push(item)
        }
      })
      return result
    },
    receiptPrintData() {
      // 根据receiptForm中的list 每5条组装成一条数据
      const data = { ...this.receiptForm }
      const listArr = ArrayUtils.splitByLength(data.list, 5)
      const arr = []
      listArr.forEach(list => {
        const totalAmount = list.map(item => item.amount).reduce((cur, obj, index) => Number(cur) + Number(obj))
        arr.push({ ...data, list, totalAmount })
      })
      return arr
    },
    getHeaders() {
      return this.isRegist ? this.registHeaders : this.cabinHeaders
    },
    serviceTypeExtendOptions() {
      // 如果服务类型为专人接机或者专车接机，则无
      const serviceType = this.serviceTypeOptions.filter(item => item.value === this.dialogForm.serviceTypeId)[0]
      if (serviceType && this.isJJService(serviceType.label)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dialogForm.otherServiceTypeId = '0'
        return [{ label: '无', value: '0' }]
      } else {
        return [...this.serviceTypeOptions]
      }
    },
    isRegist() { // 是否是登记页面
      return this.type === 'regist'
    }
  },
  watch: {
    'queryParams.hall_id': function(newVal, oldVal) {
      if (!this.isRegist) {
        this.clearPushInfoList()
        newVal ? this.initBaseWebSocket() : this.closeBaseWebSocket()
      }
    }
  },
  created() {
    this.initWebSocket()
  },
  activated() {
    this.addByRequest()
  },
  deactivated() {
    clearInterval(this.scheduled)
  },
  beforeDestroy() {
    // 页面销毁，关闭连接
    this.closeWebSocket(true)
    clearInterval(this.websocketMsgScheduled)
  },
  methods: {
    isJJService(val) {
      const serviceTypeArr = ['专人接机', '专车接机']
      return serviceTypeArr.includes(val)
    },
    // 打印休息卡
    async printRelaxCard(obj) {
      const res = await ApiObject.apiId(obj.id)
      this.dialogForm = { ...res.data }
      this.$nextTick(_ => this.$print(this.$refs['relax-card']))
    },
    clearPushInfoList() {
      this.pushInfoList = []
    },
    changeInputtingMethod() {
      this.$refs['scan-code-info-input'].$el.children[0].style['ime-mode'] = 'inactive'
    },
    checkPrintInfo() {
      const companyNameSet = new Set(this.multipleSelection.map(item => item.companyName))
      const serveDateSet = new Set(this.multipleSelection.map(item => this.$moment(item.serveDate).format('YYYY-MM-DD')))
      if (companyNameSet.size === 0) {
        this.$message.error('请选择服务单')
        return false
      }
      if (companyNameSet.size === 1 && serveDateSet.size === 1) {
        return true
      }
      this.$message.error('接待单位和接待日期必须保持一致!')
      return false
    },
    async printRecepits(id) {
      if (!id && !this.checkPrintInfo()) {
        // 如果是批量打印 接待单位必须一致，接待日期必须一致
        return
      }
      // 有id的话 为点击弹窗上的打印按钮调用
      // 否则为页面上的打印
      const ids = id || this.multipleSelection.map(item => item.id).join(',')
      const res = await this.ApiObject.getPrintInfoById(ids)
      this.receiptForm = res.data
      this.$nextTick(_ => this.$print(this.$refs['self-pay-receipt']))
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    tableRowClassName({ row, rowIndex }) {
      if ((row.settlementType || '').includes('VIP')) {
        return 'danger-row'
      }
      return ''
    },
    async addByRequest() {
      const { reserveId } = this.$route.query
      if (reserveId) {
        const res = await OrderApi.get(reserveId)
        // const data = { ...res.data, ...this.toCabinDialogForm(res.data, { 'people': 'accompanyList' }), moneyWritable: false }
        const data = res.data
        data.orderRecordId = data.id
        delete data.id
        this.dialogForm = data
        this.add()
      }
    },
    // validateSearchParams() {
    //   let flag = true
    //   if (!this.isRegist && !this.queryParams.hall_id) {
    //     this.$message.error('请选择厅房')
    //     flag = false
    //   }
    //   return flag
    // },
    toCabinDialogForm(obj, key = {}) {
      const keysChangeObj = {
        'passengerName': 'name',
        'mobile': 'mobile',
        'flightNumber': 'flightCode',
        'departureArrival': 'startCity',
        'passengerType': 'customerTypeId',
        'settlementType': 'settlementTypeId',
        'cardNumber': 'settlementCardNum',
        'serviceType': 'serviceTypeId',
        'bookingHall': 'hallId',
        'settlementAmount': 'amount',
        'orderAmount': 'orderAmount',
        'companyName': 'companyName',
        'greeting': 'greeting',
        'remarks': 'content',
        'duration': 'duration',
        ...key
      }
      const result = this.$utils.copyChangeKeysByObj(obj, keysChangeObj)
      result.type = 2 // 类型设置为接待登记
      result.orderRecordId = this.$route.query.reserveId
      return result
    },
    scanCodeRegistration() {
      if (this.scanCodeRegistrationTimer) {
        clearTimeout(this.scanCodeRegistrationTimer)
        this.scanCodeRegistrationTimer = null
      }
      if (this.checkScanCodeInfo()) {
        this.scanCodeRegistrationTimer = (setTimeout(() => {
          this.add()
        }, 500))
      }
    },
    // 校验输入是否合法
    checkScanCodeInfo() {
      return /^(.){18}$/g.test(this.scanCodeInfo.trim())
    },
    // 根据登机牌回显信息
    echoByBoardingPassNum() {
      if (this.checkScanCodeInfo()) {
        // MF8370 0112CZUH045
        const scanCodeInfo = this.scanCodeInfo.trim()
        let day = '';
        // 登机牌 航班号 座位号
        [this.dialogForm.boardingPassNum, this.dialogForm.flightCode, day, this.dialogForm.seatNum] = scanCodeInfo.match(/(.{6})(\s\d{2})(.{3}).+/)
        // this.dialogForm.flightCode = scanCodeInfo.substring(0, 6)
        // this.dialogForm.boardingPassNum = scanCodeInfo
        // this.dialogForm.seatNum = scanCodeInfo.substring(9, 12)
      }
    },
    addBefore() {
      this.echoByBoardingPassNum()
    },
    // force:是否强制关闭
    // 默认为false， 不关闭接机提醒连接
    closeWebSocket(force) {
      this.closeBaseWebSocket()
    },
    closeBaseWebSocket() {
      this.websock && this.websock.close()
    },
    handleClosed() {
      this.dialogVisible = false
      this.scanCodeInfo = ''
      this.reset()
      this.replaceRouter()
    },
    replaceRouter() {
      this.$router.replace(this.$route.path)
    },
    addAfter() {
      this.$set(this.dialogForm, 'type', this.isRegist ? 2 : 1)
    },
    editAfter() {
      this.$set(this.dialogForm, 'type', this.isRegist ? 2 : 1)
    },
    getFinalQueryParams(data) {
      data = { ...data }
      // 两舱如果没有选择hall_id传0
      // 接待登记不传
      if (!this.queryParams.hall_id && !this.isRegist) {
        data.hall_id = '0'
      }
      return data
    },
    async delPushInfo(item, index) {
      // 发送确认请求
      const res = await WebsocketApi.confirm(item)
      this.$message.success(res.message)
      this.pushInfoList.splice(index, 1)
      this.init()
    },
    addPushInfo(data) {
      data = Array.isArray(data) ? data : []
      data.forEach(item => {
        this.pushInfoList.push(item)
      })
    },
    async finishServe(obj) {
      await this.$confirm('确认服务结束?', '服务结束')
      const result = await this.ApiObject.leaveRecord(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    async handleLeave(obj) {
      await this.$confirm('确认此旅客已离舱?', '离舱')
      const result = await this.ApiObject.leave(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    /* websocket begin */
    initWebSocket() {
      if (!this.isRegist && !this.queryParams.hall_id) {
        return
      }
      this.initBaseWebSocket()
    },
    initBaseWebSocket() { // 初始化weosocket
      this.closeBaseWebSocket()
      this.clearWebsocketMsgScheduled()
      this.loading = true
      const url = this.getWebSocketUrl(this.isRegist ? 0 : this.queryParams.hall_id)
      this.websock = this.getWebSocket(url, this.websocketclose)
      this.websocketMsgScheduled = setInterval(_ => this.websocketsend(''), 20 * 1000)
    },
    getWebSocketUrl(hallId = 0) {
      return `/websocket?id=${this.$utils.getRandom()}&hallId=${hallId}`
    },
    clearWebsocketMsgScheduled() {
      this.websocketMsgScheduled && clearInterval(this.websocketMsgScheduled)
    },
    getWebSocket(url, closeFn) {
      console.log(`建立连接:${url}`)
      return new MyWebSocket({
        url: url,
        onmessage: this.websocketonmessage,
        onopen: this.websocketonopen,
        onerror: this.websocketonerror,
        onclose: closeFn
      })
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      this.clearPushInfoList()
      this.loading = false
      // 告诉服务端当前厅室
      console.log('连接建立成功')
    },
    websocketonerror() { // 连接建立失败重连
      if (this.retryCount < this.maxRetry) {
        this.retryCount++
        setTimeout(_ => this.initBaseWebSocket(), 30 * 1000)
      }
      this.loading = false
      this.clearWebsocketMsgScheduled()
      console.log('连接建立失败')
    },
    async websocketonmessage(e) { // 数据接收
      console.log(`${e.currentTarget.url}返回数据:`, e.data)
      const data = JSON.parse(e.data).data
      data && this.addPushInfo(data)
    },
    websocketsend(data) { // 数据发送
      this.websock && this.websock.send(data)
      console.log('发送数据:', data)
    },
    websocketclose() { // 关闭
      this.websock = null
    },
    /* websocket end */
    initAspectAfter() {
      !this.isRegist && this.initVipNum()
    },
    async createdAspectBefore() {
      this.initReceptUnitOptions()
      this.initServiceTypeOptions()
      this.initCustomerTypeOptions()
      await this.initHallOptions()
    },

    async initWaiterOptions() {
      const currentFormHall = this.hallOptions.filter(item => item.value === this.dialogForm.hallId)[0]
      if (this.dialogForm.hallId && currentFormHall) {
        this.waiterOptions = await DispatcherScheduleApi.getOptions(currentFormHall.label)
      } else {
        this.waiterOptions = []
      }
    },
    async initServiceTypeOptions() {
      this.serviceTypeOptions = await await DictionaryApi.getOptionsByType(this.$globalContants.DICTIONARY_ENUM.SERVER_TYPE)
    },
    async initSettlementOptions() {
      this.settlementOptions = this.dialogForm.customerTypeId ? await SettlementApi.getOptions(this.dialogForm.customerTypeId) : []
    },
    async initReceptUnitOptions() {
      this.receptUnitOptions = await ReceiveOrgApi.getOptions()
    },
    async initVipNum() {
      const res = await ApiObject.getVipNum(this.queryParams.hall_id || 0)
      this.vipNum = res.data
    },
    async initHallOptions() {
      this.hallOptions = this.isRegist ? await HallApi.otherHallList() : await HallApi.cabinHallList()
      switch ((this.hallOptions || []).length) {
        case 0:
          // 未绑定厅房 提示
          this.$message.error('用户账号下未绑定任何厅房，请联系管理员!')
          break
        case 1:
          // 两舱绑定厅房初始化默认值
          !this.isRegist && (this.queryParams.hall_id = this.hallOptions[0].value)
          break
      }
    },
    async initCustomerTypeOptions() {
      this.customerTypeOptions = this.isRegist ? await DictionaryApi.getOptionsByType(this.$globalContants.DICTIONARY_ENUM.CUSTOMER_TYPE) : await DictionaryApi.lcList()
    },
    submitAfter() {
      const { reserveId } = this.$route.query
      this.replaceRouter()
      reserveId && Bus.$emit('init')
    },
    submitBeforeValidator() {
      let flag = true
      // 校验随行人员
      const accompanyList = this.dialogForm.accompanyList
      accompanyList.forEach(item => {
        // 过滤出所需字段
        // item = this.$utils.pick(item, ['boardingPassNum', 'name', 'cabinLevel', 'seatNum'])
        item = this.$utils.pick(item, ['name'])
        const result = Object.values(item).every(Boolean)
        flag = flag && result
      })
      if (!flag) {
        this.$message.error('请输入随行人员姓名！')
      }
      return flag
    },
    delAccompany(index) {
      this.dialogForm.accompanyList.splice(index, 1)
    },
    addAccompany() {
      const data = {
        boardingPassNum: '', // 随行登机牌号
        name: '', // 姓名
        cabinLevel: '', // 座舱级别
        seatNum: '' // 座位号
      }
      this.$set(this.dialogForm.accompanyList, this.dialogForm.accompanyLis.length, data)
    }
  }
}
</script>
<style lang="scss">
  $orange:orangered;
  $blue:#409EFF;
  .table /deep/ .bg-orange{ background-color: $orange;color: black }
  .table /deep/ .bg-blue{ background-color: $blue;color: black}
</style>
<style lang="scss" scoped>
  $orange:orangered;
  $blue:#409EFF;
  $green:green;
  .form-print-btn-container{
    float: right;
    &:after{
    }
  }

  .table-statistics{
    .room-label{
      color: $green;
    }
    .room-name{
      background-color: $green;
    }
    .passager-label{
      color: $orange;
      margin-left: 10px;
    }
    .passager-num{
      background-color: $orange;
    }
    .passager-num,.room-name{
      display: inline-block;
      width: fit-content;
      padding: 0 10px;
      color: white;
      text-align: center;
      border-radius: 5px;
    }
    .tips{
      display: inline-block;
      margin-left: 10px;
      &.tips-first{
        color: $orange;
      }
      &.tips-second{
        color: $blue;
      }
    }
  }
  $printContainerDistance:10px;
  .push-prompt-container{
    position: fixed;
    bottom: 0;
    right: 0;
    width: 500px;
    z-index: 99;
    .push-prompt-name{
      height: fit-content;
      min-height: 100px;
    }
  }

  .push-prompt-card{
    margin: 20px;
  }
</style>
