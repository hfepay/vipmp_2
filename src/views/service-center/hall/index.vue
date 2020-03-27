<template>
  <div v-loading="loading" class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      :row-class-name="tableRowClassName"
      :pagination="Mixins_Pagination"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item label="当前厅房：">
            <el-select v-model="queryParams.hall_id" clearable placeholder="请选择所在厅房" @change="hallIdChange">
              <el-option
                v-for="(item, $index) in hallOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.flight_code" placeholder="输入航班号按回车查询" />
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button @click="resetQueryParams">
            重置
          </el-button>
        </base-form>
      </template>
      <template slot="layout-operate" />
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="warning" @click="printRelaxCard(scope.row)">
          打印休息卡
        </el-button>
        <el-button type="primary" @click.stop="show(scope.row)">
          查看
        </el-button>
        <!--<el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          编辑
        </el-button>-->
        <el-button v-if="scope.row.status != '1'" @click="leave(scope.row)">
          离舱
        </el-button>
        <el-button @click="dispatch(scope.row)">
          调度
        </el-button>
      </template>
    </base-table-layout>
    <update-dialog-text :dialog-form="DialogForm" :dialog-visible="dialogVisible" @closed="handleClosed" />
    <!--调度-->
    <dispatch-dialog v-model="dispatchDialogForm" task-type="taskType" :dialog-visible="dispatchDialogVisible" @closed="dispatchDialogVisible = false" />
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
    <div ref="relax-card" class="print-container">
      <relax-card :dialog-form="DialogForm" />
    </div>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/beTrade/BeTradeReceptionApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
import DispatchDialog from '../common/DispatchDialog'
import TaskApi from '../../../api/module/beDispatch/BeDispatchTaskApi'
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import WebsocketApi from '../../../api/module/socket/SocketWebsocketApi'
import UpdateDialogText from '../common/UpdateDialogText'
import MyWebSocket from '../../../utils/websocket'
import ReceptionApi from '../../../api/module/beTrade/BeTradeReceptionApi'
import { mapGetters } from 'vuex'
import RelaxCard from '../common/RelaxCard'
export default {
  name: 'HallService',
  components: { RelaxCard, DispatchDialog, UpdateDialogText },
  mixins: [Mixins],
  data() {
    return {
      loading: false,
      retryCount: 0, // 重试计数
      maxRetry: 3, // 最大重连次数
      polling: true,
      dispatchOptions: {},
      Mixins_Pagination: false,
      pushInfoList: [],
      customerTypeOptions: [],
      ApiObject,
      dialogFormRules: {},
      dialogForm: {},
      websock: null,
      websocketMsgScheduled: null,
      dispatchDialogForm: {},
      dispatchDialogVisible: false,
      Headers: [
        { label: '序号', type: 'index' },
        { label: '航班', prop: 'flightCode' },
        { label: '姓名', prop: 'name' },
        { label: '舱位', prop: 'cabinLevel' },
        { label: '座位号', prop: 'seatNum' },
        { label: '预计起飞时间', prop: 'takeOffTime' },
        { label: '航班状态', prop: 'flightStatus' },
        { label: '登机口', prop: 'loadingPort' },
        { label: '随行', prop: 'accompanyCount' },
        { label: '手机号码', prop: 'mobile' },
        { label: '结算类型', prop: 'settlementType' },
        { label: '服务人员', prop: 'waiter' },
        { label: '操作', slot: 'operator', width: 220 }
      ],
      queryParams: {
        flight_code: '',
        hall_id: ''
      },
      hallOptions: []
    }
  },
  computed: {
    ...mapGetters(['cabin']),
    finalPushInfoList() {
      const result = []
      this.pushInfoList.forEach(item => {
        if (!result.map(item => item.id).includes(item.id)) {
          result.push(item)
        }
      })
      return result
    }
  },
  watch: {
    'queryParams.hall_id': function(newVal, oldVal) {
      this.clearPushInfoList()
      newVal ? this.initBaseWebSocket() : this.closeBaseWebSocket()
    }
  },
  created() {
    this.initWebSocket()
  },
  beforeDestroy() {
    this.closeWebSocket(true)
    clearInterval(this.websocketMsgScheduled)
  },
  methods: {
    hallIdChange(val) {
      val && (this.loading = true)
    },
    // 打印休息卡
    async printRelaxCard(obj) {
      const res = await ReceptionApi.apiId(obj.id)
      this.dialogForm = { ...res.data }
      this.$nextTick(_ => this.$print(this.$refs['relax-card']))
    },
    clearPushInfoList() {
      this.pushInfoList = []
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.settlementType === 'VIP') {
        return 'danger-row'
      }
      return ''
    },
    closeWebSocket() {
      this.closeBaseWebSocket()
    },
    initWebSocket() {
      this.initBaseWebSocket()
    },
    initBaseWebSocket() { // 初始化weosocket
      this.closeBaseWebSocket()
      this.clearWebsocketMsgScheduled()
      this.queryParams.hall_id && (this.websock = this.getWebSocket(this.getWebSocketUrl(this.queryParams.hall_id), this.websocketclose))
      this.websocketMsgScheduled = setInterval(_ => this.websocketsend(''), 20 * 1000)
    },
    websocketsend(data) { // 数据发送
      this.websock && this.websock.send(data)
      console.log('发送数据:', data)
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
    websocketonerror() { // 连接建立失败重连
      if (this.retryCount < this.maxRetry) {
        this.retryCount++
        setTimeout(_ => this.initBaseWebSocket(), 30 * 1000)
      }
      this.loading = false
      console.log('连接建立失败')
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      // 告诉服务端当前厅室
      this.clearPushInfoList()
      this.loading = false
      console.log('连接建立成功')
    },
    getQueryRespData(data) {
      // 厅房服务全部是接待登记 type设置为2
      return { ...data, type: 2 }
    },
    async websocketonmessage(e) { // 数据接收
      console.log('返回数据:', e.data)
      const data = JSON.parse(e.data).data
      data && this.addPushInfo(data)
    },
    getWebSocketUrl(hallId = 0) {
      return `/websocket?id=${this.getRandom()}&hallId=${hallId}`
    },
    websocketclose(e) { // 关闭
      this.websock = null
      console.log('断开连接', e)
    },
    closeBaseWebSocket() {
      this.websock && this.websock.close()
    },
    getRandom() {
      return (Math.random() + '').substring(2, 6)
    },
    handleClosed() {
      this.Mixins_$DialogVisible = false
      this.reset()
    },
    async leave(obj) {
      await this.$confirm('确认此旅客已离舱?', '离舱')
      const result = await this.ApiObject.leave(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    async dispatch(obj) {
      const res = await TaskApi.init(obj.id)
      this.dispatchDialogForm = res.data
      this.dispatchDialogVisible = true
    },
    async getTableData() {
      const result = await this.ApiObject.hall(this.getQueryParams())
      this.tableData = result.data
    },
    getQueryParamsBefore() { // 如果没选择厅室传0
      this.queryParams.hall_id = this.queryParams.hall_id || '0'
    },
    getQueryParamsAfter() {
      if (this.queryParams.hall_id == '0') {
        this.queryParams.hall_id = ''
      }
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
    async createdAspectBefore() {
      this.initCustomerTypeOptions()
      await this.initHallOptions()
    },
    async initCustomerTypeOptions() {
      this.customerTypeOptions = await DictionaryApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.CUSTOMER_TYPE)
    },
    async initHallOptions() {
      this.hallOptions = await HallApi.otherHallList()
      switch ((this.hallOptions || []).length) {
        case 0:
          // 未绑定厅房 提示
          this.$message.error('用户账号下未绑定任何厅房，请联系管理员!')
          break
        case 1:
          // 绑定厅房初始化默认值
          this.queryParams.hall_id = this.hallOptions[0].value
          break
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
