<!--两舱服务  接待登记 记录复核弹窗-->
<template>
  <div>
    <!--弹窗内容-->
    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="1200px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form
        ref="form"
        :validate-on-rule-change="false"
        :disabled="dialogForm.secReviewStatus == 1"
        :show-default-foot="dialogForm._operate != 'show'"
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="120px"
        @submit="Mixins_$Submit"
        @cancel="cancel"
      >
        <!--预约信息  begin-->
        <el-row>
          <el-divider content-position="left">
            <span class="dialog-form-title">预约信息</span>
          </el-divider>
          <el-col :span="12">
            <el-form-item label="预约人/单位：" prop="orderBy">
              <reception-search-input
                v-model="DialogForm.orderBy"
                :maxlength="30"
                style="width: 100%"
                placeholder="请选择接待人/单位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="contactPhone">
              <el-input v-model="DialogForm.contactPhone" placeholder="请输入联系电话" :maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预约日期：" prop="appointmentDate">
              <el-date-picker
                v-model="DialogForm.appointmentDate"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                type="date"
                :clearable="false"
                placeholder="预约日期"
                @change="appointmentDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间：" prop="timeRange">
              <base-time-picker
                v-model="DialogForm.timeRange"
                :is-range="true"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接送车牌号：" prop="licensePlateNumber">
              <el-input v-model="DialogForm.licensePlateNumber" :maxlength="30" placeholder="请输入接送车牌号" />
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">-->
          <!--<el-form-item label="预约人数：" prop="people">-->
          <!--<el-input v-model.number="dialogForm.people" placeholder="请输入预约人数" type="number" />-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <!--预约信息  end-->
        <!--旅客信息  begin-->
        <el-row>
          <el-row>
            <el-form-item label="" prop="jumpFlag" label-width="30px">
              <el-radio v-model="DialogForm.jumpFlag" :label="0" :disabled="!canAddCabinData" @change="handlerJumpFlagChange">
                两舱服务
              </el-radio>
              <el-radio v-model="DialogForm.jumpFlag" :label="1" :disabled="!canAddRegistData" @change="handlerJumpFlagChange">
                接待登记
              </el-radio>
            </el-form-item>
          </el-row>
          <!--<div class="form-print-btn-container">
            <el-button type="primary" @click="printSelfPayReceipt">
              打印收费单
            </el-button>
            <el-button type="primary" @click="printRelaxCard">
              打印休息卡
            </el-button>
          </div>-->
          <el-divider content-position="left">
            <span class="dialog-form-title">旅客信息</span>
          </el-divider>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="DialogForm.name" :maxlength="30" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model="DialogForm.idCard" :maxlength="30" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobile">
              <el-input v-model="DialogForm.mobile" placeholder="请输入手机号码" :maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务：" prop="job">
              <el-input v-model="DialogForm.job" :maxlength="30" placeholder="请输入职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登机牌：" prop="boardingPassNum">
              <el-input v-model="DialogForm.boardingPassNum" :maxlength="30" placeholder="请输入登机牌" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航班号：" prop="flightCode">
              <el-input v-model="DialogForm.flightCode" :maxlength="30" placeholder="请输入航班号" @input="getFlightInfo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发/到达：" prop="startCity">
              <el-input v-model="DialogForm.startCity" :maxlength="30" placeholder="请输入出发/到达" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航空公司：" prop="airline">
              <el-input v-model="DialogForm.airline" :maxlength="30" placeholder="请输入航空公司" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座位号：" prop="seatNum">
              <el-input v-model="DialogForm.seatNum" :maxlength="30" placeholder="请输入座位号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="舱位：" prop="cabinLevel">
              <el-input v-model="DialogForm.cabinLevel" :maxlength="30" placeholder="请输入舱位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机号：" prop="aircraftCode">
              <el-input v-model="DialogForm.aircraftCode" :maxlength="30" placeholder="请输入机号" @change="aircraftCodeChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客票号：" prop="ticketNo">
              <el-input v-model="DialogForm.ticketNo" :maxlength="30" placeholder="请输入客票号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户类型：" prop="customerTypeId">
              <el-select
                v-model="DialogForm.customerTypeId"
                style="width: 100%"
                clearable
                placeholder="客户类型"
                @change="dialogForm.companyId = ''"
              >
                <el-option
                  v-for="(item, $index) in customerTypeOptions"
                  :key="$index"
                  :label="item.label"
                  :value="`${item.value}`"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算类型：" prop="settlementTypeId">
              <el-select v-model="DialogForm.settlementTypeId" style="width: 100%" clearable placeholder="结算类型" @change="settlementTypeIdChange">
                <el-option
                  v-for="(item, $index) in settlementOptions"
                  :key="$index"
                  :label="item.label"
                  :value="`${item.value}`"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接待单位：" prop="companyId">
              <el-select v-if="isBusinessTravel" v-model="DialogForm.companyId" style="width: 100%" clearable placeholder="接待单位" @change="companyIdChange">
                <el-option
                  v-for="(item, $index) in receptUnitOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input v-else v-model="DialogForm.companyName" :maxlength="30" placeholder="请输入接待单位" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号：" prop="settlementCardNum">
              <el-input v-model="DialogForm.settlementCardNum" :maxlength="20" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
          <el-col v-if="isPPCard" :span="6">
            <el-form-item label="电子记录：" prop="electronicRecord">
              <el-switch
                v-model="DialogForm.electronicRecord"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签单人：" prop="signer">
              <el-input v-model="DialogForm.signer" :maxlength="20" placeholder="请输入签单人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送登机口：" prop="signer">
              <el-switch
                v-model="DialogForm.deliverDepartureGate"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--旅客信息  end-->
        <!--服务信息 begin-->
        <el-row>
          <el-divider content-position="left">
            <span class="dialog-form-title">服务信息</span>
          </el-divider>
          <template v-if="isRegist">
            <el-row>
              <el-col :span="12">
                <el-form-item label="服务类型：" prop="serviceTypeId">
                  <el-select v-model="DialogForm.serviceTypeId" style="width: 100%" clearable placeholder="服务类型" @change="serviceTypeIdChange">
                    <el-option
                      v-for="(item, $index) in serviceTypeOptions"
                      :key="$index"
                      :label="item.label"
                      :value="`${item.value}`"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="接待人数：" prop="serveNum">
                  <el-input v-model.number="dialogForm.serveNum" type="number" @change="calcSettleMoney" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总接待人数：" prop="allNum">
                  <el-input v-model="DialogForm.allNum" type="number" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="其他服务：" prop="otherServiceTypeId">
                  <el-select v-model="DialogForm.otherServiceTypeId" style="width: 100%" clearable placeholder="其他服务" @change="otherServiceTypeIdChange">
                    <el-option
                      v-for="(item, $index) in serviceTypeExtendOptions"
                      :key="$index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="其他服务人数：" prop="otherServeNum">
                  <el-input v-model="DialogForm.otherServeNum" type="number" @change="calcSettleMoney" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务厅房：" :prop="isJJ ? '' : 'hallId'">
              <el-select v-model="DialogForm.hallId" style="width: 100%" clearable placeholder="服务厅房" @change="hallIdChange">
                <el-option
                  v-for="(item, $index) in hallOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务时长：" prop="duration">
              <el-select v-model="DialogForm.duration" style="width: 100%" clearable placeholder="使用时间">
                <el-option
                  v-for="(item, $index) in $Contants.toOptions($Contants.serviceTimeOptions)"
                  :key="$index"
                  :label="item.label"
                  :value="Number(item.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务人员：" prop="waiterId">
              <el-select v-model="DialogForm.waiterId" style="width: 100%" clearable placeholder="请输入服务人员">
                <el-option
                  v-for="(item, $index) in waiterOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单金额：" prop="orderAmount">
              <el-input v-model="DialogForm.orderAmount" disabled type="number" placeholder="请输入订单金额">
                <span slot="suffix">
                  元
                </span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" prop="content">
              <el-input v-model="DialogForm.content" :maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <template v-if="isRegist">
            <el-col :span="12">
              <el-form-item label="接机牌迎接语：" prop="greeting">
                <el-input v-model="DialogForm.greeting" :maxlength="30" placeholder="请输入接机牌迎接语" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="结算金额：" prop="amount">
              <el-input v-model="DialogForm.amount" type="number" placeholder="请输入结算金额">
                <span slot="suffix">
                  元
                </span>
              </el-input>
            </el-form-item>
          </el-col>
          <template v-if="isRegist">
            <el-col :span="12">
              <el-form-item label="全流程保障：" prop="ensuranceType">
                <el-switch
                  v-model="DialogForm.ensuranceType"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <!--服务信息 end-->
        <!--随行信息 begin-->
        <template v-if="maxNum > 0 || maxNum == -1">
          <el-row>
            <el-divider content-position="left">
              <span class="dialog-form-title">随行信息</span>
            </el-divider>
            <el-col :span="10">
              <el-form-item label="随行人员：" prop="info">
                <el-input v-model="dialogFormExtend.info" placeholder="扫描登机牌" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button v-if="canAddAccompany" type="primary" @click="Mixins_$AddAccompany">
                新增人员
              </el-button>
            </el-col>
            <el-col v-if="-1 != maxNum && Infinity !== maxNum" :span="11" :push="1">
              <span class="form-tips"><!--【{{ flightCompanyName }}】-->可携带最大随行人数是【{{ maxNum }}】</span>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-table
                  :data="dialogForm.accompanyList"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" />
                  <el-table-column prop="name" label="姓名">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name" :maxlength="30" @focus="accompanyInputOnfocus(scope.$index)" @blur="accompanyInputBlur" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="idCard" label="身份证号">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.idCard" :maxlength="30" @focus="accompanyInputOnfocus(scope.$index)" @blur="accompanyInputBlur" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="boardingPassNum" label="登机牌">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.boardingPassNum" :maxlength="30" @input="echoAccompanyFlightInfo(scope.row)" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="flightCode" label="航班号">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.flightCode" :maxlength="30" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="cabinLevel" label="舱位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.cabinLevel" :maxlength="30" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="seatNum" label="座位号">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.seatNum" :maxlength="30" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="ticketNo" label="客票号">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.ticketNo" :maxlength="30" placeholder="请输入客票号" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" @click="delAccompany(scope.$index, scope.row)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <!--随行信息 end-->
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import ReceptionApi from '../../../api/module/beTrade/BeTradeReceptionApi'
import CardApi from '../../../api/module/wechat/WechatCardApi'
import ProductOrderApi from '../../../api/module/wechat/WechatProductOrderApi'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import ReceiveOrgApi from '../../../api/module/beTrade/BeTradeReceiveOrgApi'
import DispatcherScheduleApi from '../../../api/module/beDispatch/BeDispatchDispatcherScheduleApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
import CabinApi from '../../../api/module/beTrade/BeTradeCabinApi'
import OrderApi from '../../../api/module/beTrade/BeTradeOrderApi'
import FlightDynamicApi from '../../../api/module/beTrade/BeTradeFlightDynamicApi'
import AircraftApi from '../../../api/module/beTrade/BeTradeAircraftApi'
import { validatePhoneOrNull } from '../../../utils/validate/validate-element'
import ReceptionSearchInput from '../../common/autocomplete/ReceptionSearchInput'
import MyWebSocket from '../../../utils/websocket'
import { mapGetters } from 'vuex'
import { debounce } from '../../../utils/debounce&&throttling'
const regex_serverNum = /^[1-9][0-9]?$/
const validateServerNum = (rule, value, callback) => {
  if (regex_serverNum.test(value)) {
    callback()
  } else {
    callback(new Error('请输入小于100的正整数'))
  }
}
export default {
  name: 'ReserveUpdateDialog',
  components: { ReceptionSearchInput },
  props: {
    canAddRegistData: {
      type: Boolean
    },
    canAddCabinData: {
      type: Boolean
    },
    value: {
      type: Object,
      default: function() {
        return { }
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
    /* customerTypeOptions: {
      type: Array,
      default: function() {
        return []
      }
    }*/
  },
  data() {
    return {
      scheduled: null,
      hallOptions: [],
      customerTypeOptions: [],
      currentFocusAccompanyIndex: null,
      websock: null,
      orderCardDetail: null,
      cardNoForm: {
        cardNo: ''
      },
      vipPayDialogVisible: false,
      settlementOptions: [],
      waiterOptions: [],
      serviceTypeOptions: [],
      receptUnitOptions: [],
      dialogFormExtend: {
        info: ''
      },
      dialogForm: this.value,
      accompanyMaxNum: 0,
      flightCompanyName: '',
      firstUpdateFlag: true,
      cardInfo: {}
    }
  },
  computed: {
    ...mapGetters(['username']),
    isCabin() {
      return this.dialogForm.jumpFlag == 0
    },
    isRegist() {
      return this.dialogForm.jumpFlag == 1
    },
    // 判断是否是修改，是修改第一次不联动
    isFirstUpdate() {
      return this.dialogForm.id && this.firstUpdateFlag
    },
    maxNum() {
      // 客户类型是为航司用户才限制人数
      return (!this.isFlightCompany || this.accompanyMaxNum == -1) ? Infinity : this.accompanyMaxNum
    },
    // 客户类型是否为航司用户
    isFlightCompany() {
      return (this.customerTypeOptions.find(item => item.value === this.dialogForm.customerTypeId) || {}).label === '航司客户'
    },
    canAddAccompany() {
      return this.maxNum == -1 || (this.dialogForm.accompanyList || []).length < this.maxNum
    },
    hallOptionsFilterByServiceTypeIdIncludeCurrentServiceTypeId() {
      return this.hallOptionsFilterByServiceTypeId.find(item => item.value == this.dialogForm.hallId)
    },
    hallOptionsFilterByServiceTypeId() {
      return this.dialogForm.serviceTypeId ? this.hallOptions.filter(item => item.item.typeId == this.dialogForm.serviceTypeId) : this.hallOptions
    },
    hallIdInHallOptions() {
      return this.hallOptions.filter(item => item.value === this.dialogForm.hallId)[0]
    },
    settlementTypeIdInSettlementOptions() { // 结算类型列表是否包含当前结算类型id
      return this.settlementOptions.find(item => item.value === this.dialogForm.settlementTypeId)
    },
    dialogFormRules() {
      const baseRules = {
        orderBy: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        appointmentDate: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        name: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serveNum: [{ required: true, trigger: 'change', validator: validateServerNum }],
        allNum: [{ required: true, trigger: 'change', validator: validateServerNum }],
        otherServeNum: [],
        // companyId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serviceTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        customerTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // otherServiceTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        contactPhone: [{ trigger: 'change', validator: validatePhoneOrNull }],
        mobile: [{ trigger: 'change', validator: validatePhoneOrNull }],
        // boardingPassNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // flightCode: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // cabinLevel: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // aircraftCode: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // idCard: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // seatNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // startCity: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        settlementTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // settlementCardNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        hallId: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
        // amount: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // orderAmount: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // waiterId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // duration: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // accompanyCount: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      }
      /* if (!this.isJJ && !this.isCabin) {
        baseRules.hallId = [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      }*/
      if (this.dialogForm.otherServiceTypeId) {
        baseRules.otherServeNum = [{ required: true, trigger: 'change', validator: validateServerNum }]
      } else {
        baseRules.otherServeNum = [{ required: false, trigger: 'change' }]
      }
      return baseRules
    },
    settlementTypeName() {
      const id = this.dialogForm.settlementTypeId
      return id ? this.settlementOptions.find(item => item.value === id).label : ''
    },
    // 厅房名字
    hallName() {
      const hall = this.hallOptions.filter(item => item.value == this.dialogForm.hallId)[0]
      return hall ? hall.label : ''
    },
    // 判断选中的是否是商旅用户
    isBusinessTravel() {
      return this.dialogForm.customerTypeCN === '商旅客户'
    },
    isPPCard() {
      return this.dialogForm.companyName === 'PP卡'
    },
    hasCard() {
      return this.dialogForm.customerTypeCN === 'PP卡'
    },
    // 是否接机服务
    isJJ() {
      const serviceTypeArr = ['专人接机', '专车接机']
      const ids = [this.dialogForm.serviceTypeId, this.dialogForm.otherServiceTypeId]
      const selectIds = this.serviceTypeOptions.filter(item => ids.includes(item.value))
      const checkIds = this.serviceTypeOptions.filter(item => serviceTypeArr.includes(item.label))
      // checkIds 和 selectIds如果有交集返回true
      return selectIds.filter(item => checkIds.includes(item))[0] ? 1 : 0
    },
    serviceTypeExtendOptions() {
      const serviceTypeArr = ['专人接机', '专车接机']
      // 如果服务类型为专人接机或者专车接机，则无
      const serviceType = this.serviceTypeOptions.filter(item => item.value == this.dialogForm.serviceTypeId)[0]
      if (serviceType && serviceTypeArr.includes(serviceType.label)) {
        this.dialogForm.otherServiceTypeId = ''
        return [{ label: '无', value: '' }]
      } else {
        return (this.serviceTypeOptions || []).filter(item => serviceTypeArr.includes(item.label))
      }
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          for (const condition in this.value) {
            if (condition === 'timeRange' && this.value[condition].length === 0) {
              this.$set(this.dialogForm, condition, '')
            } else {
              this.$set(this.dialogForm, condition, this.value[condition])
            }
          }
          if (!this.dialogForm.id) {
            this.$set(this.dialogForm, 'appointmentDate', this.$moment().format('YYYY-MM-DD'))
            this.$set(this.dialogForm, 'duration', 2)
            // this.$set(this.dialogForm, 'jumpFlag', 1)
            this.initHallId()
          }
          this.$nextTick(_ => {
            this.$refs.form && this.$refs.form.clearValidate()
            this.firstUpdateFlag = false
          })
        } else {
          this.dialogFormExtend.info = ''
          this.firstUpdateFlag = true
          this.accompanyMaxNum = 0
        }
      }
    },
    'dialogForm.jumpFlag': {
      immediate: true,
      handler: function(newVal) {
        this.initCustomerTypeOptions()
        this.initHallOptions()
      }
    },
    'dialogFormExtend.info': function(newVal) {
      if (newVal && /^(.){18}$/g.test(newVal)) {
        // eslint-disable-next-line no-unused-vars
        const [boardingPassNum, flightCode, day, seatNum] = newVal.match(/(.{6})(\s\d{2})(.{3}).+/)
        this.addAccompany({ boardingPassNum, flightCode, seatNum })
        this.dialogFormExtend.info = ''
      }
    },
    'dialogForm.aircraftCode': function(newVal) {
      this.initMaxNum()
    },
    'dialogForm.customerTypeId': async function(newVal, oldVal) {
      await this.initSettlementOptions()
      if (!this.settlementTypeIdInSettlementOptions) {
        this.dialogForm.settlementTypeId = ''
      }
      this.initName(newVal, this.customerTypeOptions, 'customerTypeCN')
      if (!this.isBusinessTravel) {
        this.dialogForm.companyId = ''
      }
    },
    'dialogForm.settlementTypeId': function(newVal, oldVal) {
      this.initMaxNum()
    },
    'dialogForm.hallId': function(newVal, oldVal) {
      this.initWaiterOptions()
    },
    'dialogForm.waiterId': function(newVal, oldVal) {
      this.initName(newVal, this.waiterOptions, 'waiterCN')
    },
    'dialogForm.boardingPassNum': function(newVal, oldVal) {
      if (this.checkScanCodeInfo(newVal)) {
        const scanCodeInfo = newVal.trim()
        // eslint-disable-next-line no-unused-vars
        let day = ``;
        // 登机牌 航班号 座位号
        [this.dialogForm.boardingPassNum, this.dialogForm.flightCode, day, this.dialogForm.seatNum] = scanCodeInfo.match(/(.{6})(\s\d{2})(.{3}).+/)
        this.getFlightInfo()
        !this.dialogForm.id && this.boardingPassNum()
      }
    },
    maxNum: function(newVal, oldVal) {
      // todo最大人数变化
      /* if (newVal < oldVal) {
        this.dialogForm.accompanyList.splice(newVal)
      }*/
    }
  },
  created() {
    this.init()
    this.initWebSocket()
  },
  beforeDestroy() {
    this.closeWebSocket()
  },
  methods: {
    async boardingPassNum() {
      if (this.dialogForm.boardingPassNum && this.dialogForm.appointmentDate) {
        await OrderApi.boardingPassNum(this.dialogForm)
      }
    },
    async serviceTypeIdChange(newVal) {
      await this.initHallOptions()
      if (this.isCabin) {
        return
      }
      if (!newVal || !this.hallIdInHallOptions) {
        this.dialogForm.hallId = ''
      }
      this.initName(newVal, this.serviceTypeOptions, 'serviceTypeCN')
      this.$refs.form.clearValidate('hallId')
      this.calcSettleMoney()
    },
    settlementTypeIdChange(newVal) {
      this.initName(this.dialogForm.settlementTypeId, this.settlementOptions, 'settlementCN')
      this.calcSettleMoney()
    },
    hallIdChange(newVal) {
      this.calcSettleMoney()
      this.initName(newVal, this.hallOptions, 'hallCN')
    },
    otherServiceTypeIdChange(val) {
      this.calcSettleMoney()
      this.initName(val, this.serviceTypeOptions, 'otherServiceTypeCN')
    },
    aircraftCodeChange(val) {
      this.getAirline(val)
    },
    handlerJumpFlagChange() {
      this.$set(this.dialogForm, 'hallId', '')
      this.$set(this.dialogForm, 'customerTypeId', '')
    },
    echoAccompanyFlightInfo: function(obj) {
      const { boardingPassNum } = obj
      if (this.checkScanCodeInfo(boardingPassNum)) {
        const scanCodeInfo = boardingPassNum.trim()
        // eslint-disable-next-line no-unused-vars
        let day = '';
        // 登机牌 航班号 座位号
        [obj.boardingPassNum, obj.flightCode, day, obj.seatNum] = scanCodeInfo.match(/(.{6})(\s\d{2})(.{3}).+/)
      }
    },
    // 校验输入是否合法
    checkScanCodeInfo(val) {
      return /^(.){18}$/g.test(val)
    },
    async initMaxNum() {
      if (this.dialogForm.aircraftCode && this.dialogForm.settlementTypeId && this.isFlightCompany) {
        const res = await CabinApi.getMostPeople({ aircraftCode: this.dialogForm.aircraftCode, settlementType: this.dialogForm.settlementTypeId })
        this.accompanyMaxNum = Number(res.data.number)
        this.flightCompanyName = res.data.name
      }
    },
    echoAccompanyInfo(data, $index) {
      Object.keys(data).forEach(item => {
        this.$set(this.dialogForm.accompanyList[$index], item, data[item])
      })
    },
    accompanyInputOnfocus(index) {
      this.currentFocusAccompanyIndex = index
    },
    accompanyInputBlur(index) {
      this.currentFocusAccompanyIndex = null
    },
    async initHallOptions() {
      if (this.isCabin) {
        this.hallOptions = await HallApi.cabinHallList()
        if (this.hallOptions.length === 0 && this.dialogVisible) {
          this.$message.error('用户账号下未绑定隔离区内厅房，请联系管理员!')
        }
      } else if (this.dialogForm.serviceTypeId) {
        this.hallOptions = await HallApi.otherHallList({ serviceTypeId: this.dialogForm.serviceTypeId })
      } else {
        this.hallOptions = []
      }
      this.initHallId()
      return true
    },
    initHallId() {
      // 厅房列表只有一个 默认选中
      if (this.hallOptions.length === 1 && this.isCabin) {
        this.dialogForm.hallId = this.hallOptions[0].value
        this.hallIdChange(this.dialogForm.hallId)
      }
    },
    closeWebSocket() {
      this.websock && this.websock.close()
    },
    async websocketonmessage(e) { // 数据接收
      console.log('返回数据:', e.data)
      const data = JSON.parse(e.data)
      if (this.currentFocusAccompanyIndex !== null) { // 如果是光标在扫描身份证输入框
        this.echoAccompanyInfo(data, this.currentFocusAccompanyIndex)
        this.dialogFormExtend.info = ''
      } else {
        Object.keys(data).forEach(item => this.$set(this.dialogForm, item, data[item]))
      }
    },
    websocketclose(e) { // 关闭
      this.websock = null
      console.log('断开连接', e)
    },
    initWebSocket() {
      this.websock = new MyWebSocket({
        url: `/socketServer/${this.username}`,
        onmessage: this.websocketonmessage,
        close: this.websocketclose,
        domain: 'ws://localhost:18195'
      })
    },
    async getAirline(airlineCode) {
      airlineCode = airlineCode || this.dialogForm.aircraftCode
      this.calcSettleMoney()
      const res = await AircraftApi.getFlightCompanyByAirlineCode(airlineCode)
      const { airline } = res.data
      this.$set(this.dialogForm, 'airline', airline)
    },
    appointmentDateChange() {
      this.getFlightInfo()
      this.boardingPassNum()
    },
    getFlightInfo: debounce(async function() {
      if (/^\w{6}$/.test(this.dialogForm.flightCode) && this.dialogForm.appointmentDate) {
        const res = await FlightDynamicApi.getFlightDynamic({ flightCode: this.dialogForm.flightCode, date: this.dialogForm.appointmentDate })
        const { aircraftCode, from_Cn, to_Cn } = res.data
        this.dialogForm.startCity = `${from_Cn}/${to_Cn}`
        this.$set(this.dialogForm, 'aircraftCode', aircraftCode)
        this.aircraftCodeChange()
      }
    }),
    async queryCard() {
      if (this.cardNoForm.cardNo) {
        const data = {
          datadictId: this.isRegist ? this.dialogForm.serviceTypeId : 17,
          // proId: '',
          cardNum: this.cardNoForm.cardNo,
          price: this.dialogForm.orderAmount,
          num: (this.dialogForm.accompanyList || []).length + 1,
          srcType: this.isRegist ? 2 : 1,
          isJJ: this.isJJ,
          hallId: this.dialogForm.hallId,
          otherService: this.dialogForm.otherServiceTypeId,
          aircraftCode: this.dialogForm.aircraftCode,
          companyId: this.dialogForm.companyId,
          settlementTypeId: this.dialogForm.settlementTypeId
        }
        const res = await CardApi.orderCardDetail(data)
        this.orderCardDetail = res.data
      } else {
        this.$message.error('请输入卡号')
      }
    },
    companyIdChange(val) {
      this.calcSettleMoney()
      this.initName(val, this.receptUnitOptions, 'companyName')
    },
    initName(val, list, key) {
      if (val) {
        const result = list.filter(item => item.value == val)[0]
        result && this.$set(this.dialogForm, key, result.label)
      } else {
        this.$set(this.dialogForm, key, '')
      }
    },
    validateCalaMoneyCondition() {
      // 结算类型必须
      const condition1 = !!this.dialogForm.settlementTypeId
      // 服务人数小于100
      const condition2 = !!this.dialogForm.serveNum && regex_serverNum.test(this.dialogForm.serveNum)
      // 如果选了其它服务 其它服务人数小于100
      // const condition3 = !!this.dialogForm.otherServiceTypeId && regex_serverNum.test(this.dialogForm.otherServeNum) || !this.dialogForm.otherServiceTypeId
      const condition3 = !!this.dialogForm.otherServiceTypeId && regex_serverNum.test(this.dialogForm.otherServeNum) || !this.dialogForm.otherServiceTypeId
      return this.isCabin || (condition1 && condition2 && condition3)
    },
    async calcSettleMoney() { // 计算结算金额
      if (this.dialogForm.orderId) {
        console.log('小程序下单不用调用计算金额接口')
        return
      }
      // 如果是接待登记没有厅房也可以结算
      if (this.validateCalaMoneyCondition()) {
        const data = this.getCalcSettleMoneyData()
        let res = { data: 0 }
        // if (this.page === 'cabin') {
        //   res = await CabinApi.getAmount(data)
        // } else if (this.page === 'regist') {
        //   res = await ReceptionApi.getAmount(data)
        // } else if (this.page === 'reserve') {
        //   res = await OrderApi.getAmount(data)
        // }
        res = await ReceptionApi.getAmount(data)
        this.dialogForm.amount = this.dialogForm.id ? this.dialogForm.amount : res.data
        this.dialogForm.orderAmount = res.data
      }
    },
    getCalcSettleMoneyData() { // 获取算钱数据
      // 两舱 所需字段flightCode customerTypeId  settlementTypeId hallId peopleNum
      // 接待登记 所需字段 companyId customerTypeId hallId peopleNum
      // 预约计算 所需字段 hallId peopleNum
      // datadictId 服务类型(id) isJJ 是否接机服务：0不是1是
      // const peopleNum = this.dialogForm.accompanyList.length + 1
      const peopleNum = this.dialogForm.accompanyList.length + 1
      const data = {
        companyId: this.dialogForm.companyId,
        hallId: this.dialogForm.hallId,
        customerTypeId: this.dialogForm.customerTypeId,
        // peopleNum: peopleNum,
        serveNum: this.isCabin ? peopleNum : this.dialogForm.serveNum,
        otherServeNum: this.isCabin ? 0 : (this.dialogForm.otherServeNum || 0),
        datadictId: this.isCabin ? 17 : this.dialogForm.serviceTypeId,
        otherService: this.dialogForm.otherServiceTypeId,
        settlementTypeId: this.dialogForm.settlementTypeId,
        aircraftCode: this.dialogForm.aircraftCode,
        settlementCN: this.dialogForm.settlementCN
      }
      // const data = {
      //   hallId: this.dialogForm.hallId,
      //   datadictId: this.dialogForm.serviceTypeId,
      //   peopleNum: this.dialogForm.accompanyList.length,
      //   isJJ: this.isJJ
      // }
      let extendData = {}
      if (this.page === 'cabin') {
        // extendData = {
        //   flightCode: this.dialogForm.flightCode,
        //   customerTypeId: this.dialogForm.customerTypeId,
        //   settlementTypeId: this.dialogForm.settlementType
        // }
      } else if (this.page === 'regist') {
        extendData = {
          customerTypeId: this.dialogForm.customerTypeId
        }
        // 下拉框才有companyId
        this.isBusinessTravel && (extendData.companyId = this.dialogForm.companyId)
      }
      return { ...data, ...extendData }
    },
    async printSelfPayReceipt() {
      this.$print(this.$refs['self-pay-receipt'])
    },
    // 打印休息卡
    async printRelaxCard() {
      const settlementType = this.settlementOptions.find(item => item.value === this.dialogForm.settlementTypeId)
      this.dialogForm.settlementTypeName = settlementType ? settlementType.label : ''
      this.$print(this.$refs['relax-card'])
      delete this.dialogForm.settlementTypeName
    },
    cancel() {
      this.$emit('closed')
    },
    init() {
      // this.initCustomerTypeOptions()
      // this.initHallOptions()
      this.initReceptUnitOptions()
      this.initServiceTypeOptions()
    },
    async initCustomerTypeOptions() {
      this.customerTypeOptions = this.isRegist ? await DictionaryApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.CUSTOMER_TYPE) : await DictionaryApi.lcList()
    },
    async initWaiterOptions() {
      const currentFormHall = this.hallOptions.filter(item => item.value == this.dialogForm.hallId)[0]
      if (this.dialogForm.hallId && currentFormHall) {
        this.waiterOptions = await DispatcherScheduleApi.getOptions(currentFormHall.label)
        if (!this.waiterOptions.filter(item => item.value === this.dialogForm.waiterId)[0]) {
          this.dialogForm.waiterId = ''
        }
      } else {
        this.waiterOptions = []
      }
    },
    async initServiceTypeOptions() {
      this.serviceTypeOptions = await DictionaryApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.SERVER_TYPE)
    },
    async initSettlementOptions() {
      this.settlementOptions = this.dialogForm.customerTypeId ? await SettlementApi.getOptions(this.dialogForm.customerTypeId) : []
      return true
    },
    async initReceptUnitOptions() {
      this.receptUnitOptions = await ReceiveOrgApi.getBusinessTravelOptions()
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
    submit(force) {
      if (this.dialogForm.accompanyList.length > this.maxNum) {
        this.dialogForm.accompanyList.splice(this.maxNum)
      }
      this.initName(this.dialogForm.settlementTypeId, this.settlementOptions, 'settlementCN')
      const data = this.getSubmitData()
      this.$emit('input', data)
      this.$emit('submit', data)
    },
    getSubmitData() {
      const data = { ...this.dialogForm }
      if (this.isCabin) {
        const arr = ['serviceTypeId', 'serveNum', 'allNum', 'otherServiceTypeId', 'otherServeNum', 'greeting']
        arr.forEach(item => {
          data[item] = undefined
        })
      }
      if (!this.isPPCard) {
        delete data.electronicRecord
      }
      return data
    },
    async vipPay() {
      // 调用扣费接口
      const data = {
        payType: 3, // 支付方式：1微信 2支付宝 3会员卡
        cardId: this.orderCardDetail.id,
        cardNo: this.cardNoForm.cardNo,
        pay: (this.orderCardDetail || {}).discountPrice,
        type: 0, // 类型：0支付 1退款
        srcType: this.isRegist ? 2 : 1
      }
      await ProductOrderApi.pay(data)
      this.vipPayDialogVisible = false
      this.submit(true)
    },
    /* 表单重置 */
    reset() {
      delete this.dialogForm.id
      this.dialogForm = this.$utils.reset(this.dialogForm)
      const form = this.$refs['form']
      form && form.resetFields()
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-tips{
    color: green;
    line-height: 28px;
  }
  .form-print-btn-container{
    float: right;
  }
  .dialog-form-title{
    font-size: 18px;
    font-weight: bold;
  }
</style>
