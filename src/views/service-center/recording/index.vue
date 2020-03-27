<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      v-loading="tableLoading"
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      max-height="500"
      :pagination="Mixins_Pagination"
      :data="Mixins_$TableData"
      @sizeChange="Mixins_$SizeChange"
      @selection-change="handleSelectionChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item> <el-input v-model="queryParams.name" placeholder="旅客姓名" /> </el-form-item>
          <el-form-item> <el-input v-model="queryParams.flightCode" placeholder="航班" /> </el-form-item>
          <el-form-item> <el-input v-model="queryParams.company" placeholder="航空公司" /> </el-form-item>

          <el-form-item prop="sex">
            <el-select v-model="queryParams.type" clearable placeholder="登记位置">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.registrationLocation)"
                :key="$index"
                :label="item.label"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryParams.timeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="~"
              start-placeholder="按接待日期查询"
              end-placeholder="按接待日期查询"
              @change="search"
            />
          </el-form-item>
          <el-form-item><el-input v-model="queryParams.signer" placeholder="签单人" /> </el-form-item>
          <el-form-item>
            <customer-type-select v-model="queryParams.datadictId" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.selType" clearable placeholder="结算类型">
              <el-option
                v-for="(item, $index) in settlementOptions"
                :key="$index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <reception-search-input v-model="queryParams.companyName" />
          </el-form-item>
          <!--<el-form-item>-->
          <!--<el-select v-model="queryParams.selType" clearable placeholder="结算类型">-->
          <!--<el-option-->
          <!--v-for="(item, $index) in settlementOptions"-->
          <!--:key="$index"-->
          <!--:label="item.label"-->
          <!--:value="item.label"-->
          <!--/>-->
          <!--</el-select>-->
          <!--</el-form-item>-->

          <el-form-item>
            <el-select v-model="queryParams.status" clearable placeholder="请选择状态">
              <el-option
                v-for="(item, $index) in statusOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item> <el-input v-model="queryParams.aircraftCode" placeholder="输入机号查询" /> </el-form-item>
          <template v-if="!isFinancePage">
            <el-form-item>
              <hall-room-select v-model="queryParams.hallId" />
            </el-form-item>
            <el-form-item>
              <service-type-select v-model="queryParams.serviceTypeCn" />
              <!--              <service-type-select v-model="queryParams.serviceTypeId" />-->
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="queryParams.deleteFlag" true-label="1" @change="search">
                显示已删除订单
              </el-checkbox>
            </el-form-item>
          </template>
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button v-show="queryParams.status == 1" type="primary" @click="exportExcel">
            导出
          </el-button>
          <el-button type="primary" @click="review">
            {{ getText }}
          </el-button>
          <template v-if="isFinancePage">
            <el-button type="warning" @click="oneClickReview">
              一键审核
            </el-button>
          </template>
        </base-form>
      </template>
      <template slot="layout-operate" />
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <template v-if="scope.row.deleteFlag == 0">
          <el-button v-if="isFinancePage || scope.row.secReviewBy" @click.stop="handleShow(scope.row)">
            查看
          </el-button>
          <el-button v-if="!isFinancePage && !scope.row.secReviewBy" @click.stop="handleEdit(scope.row)">
            修改
          </el-button>
          <el-button v-else-if="type === 'finance' && scope.row.reviewStatus == 1" type="danger" @click="cancel(scope.row)">
            撤销审核
          </el-button>
          <!---->
          <el-button v-if="canDel(scope.row)" type="danger" @click.stop="showDelDialog(scope.row)">
            删除
          </el-button>
        </template>
      </template>
      <template #reviewStatus="{scope}">
        <a :title="scope.row.delReason">
          {{ scope.row.deleteFlag == 1 ? '已删除' : reviewOptions[scope.row.reviewStatus] }}
        </a>
      </template>
    </base-table-layout>
    <update-dialog
      v-model="DialogForm"
      page="reserve"
      :customer-type-options="dialogCustomerTypeOptions"
      :hall-options="hallOptions"
      :dialog-visible="dialogVisible"
      @submit="Mixins_$Submit"
      @closed="handleClosed"
    />
    <update-dialog-text
      :key="detailDialogVisible"
      :dialog-form="DialogForm"
      page="reserve-detail"
      :customer-type-options="customerTypeOptions"
      :hall-options="hallOptions"
      :dialog-visible="detailDialogVisible"
      @submit="Mixins_$Submit"
      @closed="detailDialogVisible = false"
    >
      <template #footer>
        <el-form-item style="text-align: center">
          <template v-if="isFinancePage">
            <el-button
              v-if="dialogForm.secReviewStatus == 1"
              type="danger"
              @click="cancel(dialogForm, _ => detailDialogVisible = false)"
            >
              撤销审核
            </el-button>
            <el-button v-else type="primary" @click="reviewSingle(dialogForm, _ => detailDialogVisible = false)">
              审核
            </el-button>
            <el-button @click="detailDialogVisible = false">
              取消
            </el-button>
          </template>
        </el-form-item>
      </template>
    </update-dialog-text>

    <base-dialog
      title="删除"
      :visible.sync="delDialogVisible"
      center
      width="400px"
      @closed="delForm.delReason = '';$refs.delForm.resetFields()"
    >
      <base-form
        ref="delForm"
        :model="delForm"
        :rules="delFormRules"
        alias="delForm"
        label-width="80px"
        @submit="handleDel(delForm)"
        @cancel="delDialogVisible = false"
      >
        <el-form-item label="备注:" prop="delReason">
          <el-input
            v-model="delForm.delReason"
            :autosize="{ minRows: 2}"
            type="textarea"
            placeholder="请输入内容"
            :maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import { mapGetters } from 'vuex'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import ApiObject from '../../../api/module/beTrade/BeTradeReviewApi'
import CabinApi from '../../../api/module/beTrade/BeTradeCabinApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
import ReceptionApi from '../../../api/module/beTrade/BeTradeReceptionApi'
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import UpdateDialog from '../common/UpdateDialog'
import CustomerTypeSelect from '../../common/select/CustomerTypeSelect'
import ReceptionSearchInput from '../../common/autocomplete/ReceptionSearchInput'
import UpdateDialogText from '../common/UpdateDialogText'
import BaseDialog from '../../../components/dialog/BaseDialog'
import HallRoomSelect from '../../common/select/HallRoomSelect'
import ServiceTypeSelect from '../../common/select/ServiceTypeSelect'
export default {
  name: 'ServerCenterRecording',
  components: {
    ServiceTypeSelect,
    HallRoomSelect, BaseDialog, UpdateDialogText, ReceptionSearchInput, CustomerTypeSelect, UpdateDialog },
  mixins: [Mixins],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      delFormRules: {
        delReason: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      delForm: {
        id: '',
        delReason: ''
      },
      timeRangeToCamelCase: true,
      delDialogVisible: false,
      detailDialogVisible: false,
      pageObj: { page: 1, limit: 30, total: 0 }, // page对象
      dialogForm: {
        companyId: '', // 接待单位
        serviceTypeCn: '', // 服务类型id
        otherServiceTypeId: '', // 其他服务类型id
        name: '', // 贵宾姓名,
        mobile: '', //  手机号码
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
      selectList: [],
      settlementOptions: [],
      customerTypeOptions: [],
      dialogCustomerTypeOptions: [],
      hallOptions: [],
      ApiObject,
      queryParams: {
        name: '',
        deleteFlag: '0',
        receptionUnitName: '',
        customerType: '',
        aircraftCode: '',
        flightCode: '',
        company: '',
        selType: '',
        status: '',
        serviceTypeCn: '',
        hallId: '',
        timeRange: []
      }
    }
  },
  computed: { // 是否是财务审核界面
    ...mapGetters(['roles']),
    canDel() {
      return (obj) => {
        // 记录复核页面 && 没有二次审核人 && 有记录删除角色 && 未被删除
        return !this.isFinancePage && !obj.secReviewBy && this.roles.includes('记录删除') && obj.deleteFlag != 1
      }
    },
    statusOptions() {
      return this.$Contants.toOptions(this.reviewOptions)
    },
    reviewOptions() {
      return this.isFinancePage ? this.$Contants.reviewType : this.$Contants.reviewSecondType
    },
    getText() {
      return this.isFinancePage ? '审核' : '复核'
    },
    headers() {
      return [
        { label: '选择', type: 'selection', fixed: true, selectable: function(row, index) {
          return row.reviewStatus != 1
        } },
        { label: '序号', type: 'index' },
        // { label: '服务单号', prop: 'serviceNum' },
        { label: '登记位置', prop: 'type', format: {
          1: '接待登记',
          2: '两舱登记'
        }},
        { label: '接待时间', prop: 'createTime' },
        { label: '客户类型', prop: 'dictName' },
        { label: '接待单位', prop: 'company' },
        /* { label: '接待类型', prop: 'dictName' },
          { label: '预约人/单位', prop: 'company' },*/
        { label: '航班', prop: 'flightCode' },
        { label: '机号', prop: 'aircraftCode' },
        { label: '航空公司', prop: 'airline' },
        { label: '旅客姓名', prop: 'name' },
        { label: '舱位', prop: 'cabinLevel' },
        { label: '座位', prop: 'seatNum' },
        { label: '服务类型', prop: 'serviceTypeCn' },
        { label: '服务厅房', prop: 'hallCn' },
        { label: '结算类型', prop: 'selType' },
        { label: '卡号', prop: 'settlementCardNum' },
        { label: '接待人数', prop: 'accompanyCount' },
        { label: '签单人', prop: 'signer' },
        { label: '状态', prop: 'reviewStatus', slot: 'reviewStatus' },
        { label: this.isFinancePage ? `${this.getText}人` : `${this.getText}人`, prop: this.isFinancePage ? 'secReviewBy' : 'firstReviewBy' },
        { label: this.isFinancePage ? `${this.getText}时间` : `${this.getText}时间`, prop: this.isFinancePage ? 'secReviewTime' : 'firstReviewTime' },
        { label: '操作', slot: 'operator', width: 180, fixed: 'right' }
      ]
    },
    isFinancePage() {
      return this.type === 'finance'
    }
  },
  watch: {
    'queryParams.datadictId': function(newVal) {
      this.queryParams.selType = ''
      this.initSettlementOptions()
    }
  },
  methods: {
    async cancel(obj, fn) {
      await this.$confirm('确认撤销审核?', '撤销审核')
      await ApiObject.reject(obj.id)
      this.init()
      fn && fn()
    },
    handleClosed() {
      this.Mixins_$DialogVisible = false
      this.reset()
    },
    async submit() {
      const data = this.getDialogFormParams()
      const result = (data.type == 1 ? await CabinApi.update(data) : await ReceptionApi.update(data))
      this.$message.success(result.message)
      this.Mixins_$DialogVisible = false
      this.init()
    },
    async initDialogCustomerTypeOptions(obj) {
      // 2: 两舱, 1接待登记
      this.dialogCustomerTypeOptions = obj.type == 2 ? await DictionaryApi.lcList() : await DictionaryApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.CUSTOMER_TYPE)
    },
    async getDetail(obj) {
      await this.initHallOptions(obj)
      this.initDialogCustomerTypeOptions(obj)
      // 2: 两舱, 1接待登记
      const res = (obj.type == 2 ? await CabinApi.get(obj.id) : await ReceptionApi.get(obj.id))
      // 弹窗2接待登记 1 两舱
      this.dialogForm = { ...res.data, type: obj.type == 2 ? 1 : 2 }
      return true
    },
    async handleShow(obj, fn) {
      await this.getDetail(obj)
      this.detailDialogVisible = true
      // this.dialogForm._operate = 'show'
    },
    async handleEdit(obj, fn) {
      await this.getDetail(obj)
      this.dialogVisible = true
    },
    showDelDialog(obj) {
      this.delForm = { ...obj }
      this.delDialogVisible = true
    },
    async handleDel(obj) {
      // const result = (obj.type == 2 ? await CabinApi.del(obj.id) : await ReceptionApi.del(obj.id))
      const result = await ApiObject.del(obj)
      this.$message.success(result.message)
      this.delDialogVisible = false
      this.init()
    },
    getFinalQueryParams(params) {
      const data = { ...params }
      if (!data.datadictId) {
        data.selType = ''
      }
      data.listType = (this.type === 'finance' ? 2 : 1)
      if (this.isFinancePage) {
        delete data.deleteFlag
      }
      return data
    },
    getQueryParamsAfter() {
      delete this.queryParams.listType
    },
    handleSelectionChange(val) {
      this.selectList = val
    },
    async reviewSingle(obj) {
      await this.$confirm(`确认${this.getText}?`, `${this.getText}`)
      const ids = obj.id
      const res = (this.isFinancePage ? await ApiObject.secPass(ids) : await ApiObject.firstPass(ids))
      this.init()
      this.$message.success(res.message)
      this.detailDialogVisible = false
    },
    async oneClickReview() {
      await this.$confirm(`查询条件已变更，请确认查询内容正确并审核！`)
      const res = await ApiObject.reviewByParams(this.getQueryParams())
      this.init()
      this.$message.success(res.message)
    },
    async review() {
      if (this.selectList.length) {
        await this.$confirm(`确认${this.getText}?`, `${this.getText}`)
        const ids = this.selectList.map(item => item.id).join(',')
        const res = (this.isFinancePage ? await ApiObject.secPass(ids) : await ApiObject.firstPass(ids))
        this.init()
        this.$message.success(res.message)
      } else {
        this.$message.error(`请选择${this.getText}记录`)
      }
    },
    createdAspectBefore() {
      // this.initSettlementOptions()
      this.initCustomerTypeOptions()
      // this.initHallOptions()
    },
    async initHallOptions(obj) {
      // 2: 两舱, 1接待登记
      this.hallOptions = obj.type == 2 ? await HallApi.cabinHallList() : await HallApi.otherHallList()
      return true
    },
    async initCustomerTypeOptions() {
      this.customerTypeOptions = await DictionaryApi.lcList()
    },
    async initSettlementOptions() {
      if (!this.queryParams.datadictId) {
        this.settlementOptions = []
      } else {
        this.settlementOptions = await SettlementApi.getOptions(this.queryParams.datadictId)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
