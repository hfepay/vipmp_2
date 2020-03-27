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
        :disabled="dialogForm.secReviewStatus == 1 || dialogForm._operate == 'show'"
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="120px"
        @submit="Mixins_$Submit"
        @cancel="cancel"
      >
        <!--旅客信息  begin-->
        <el-row>
          <div v-if="dialogForm.id && isCabin" class="form-print-btn-container">
            <!--商旅和航司用户无法打印-->
            <el-button type="primary" :disabled="isFlightCompany || isBusinessTravel" @click="printSelfPayReceipt">
              打印收费单
            </el-button>
            <!--<el-button type="primary" @click="printRelaxCard">
              打印休息卡
            </el-button>-->
          </div>
          <el-divider content-position="left">
            <span class="dialog-form-title">旅客信息</span>
          </el-divider>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="DialogForm.name" placeholder="请输入姓名" :maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model="DialogForm.idCard" placeholder="请输入身份证号" :maxlength="30" />
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
              <el-input v-model="DialogForm.job" placeholder="请输入职务" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登机牌：" prop="boardingPassNum">
              <el-input v-model="DialogForm.boardingPassNum" placeholder="请输入登机牌" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航班号：" prop="flightCode">
              <el-input v-model="DialogForm.flightCode" placeholder="请输入航班号" :maxlength="10" @input="getFlightInfo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发/到达：" prop="startCity">
              <el-input v-model="DialogForm.startCity" placeholder="请输入出发/到达" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航空公司：" prop="airline">
              <el-input v-model="DialogForm.airline" placeholder="请输入航空公司" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座位号：" prop="seatNum">
              <el-input v-model="DialogForm.seatNum" placeholder="请输入座位号" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="舱位：" prop="cabinLevel">
              <el-input v-model="DialogForm.cabinLevel" placeholder="请输入舱位" :maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机号：" prop="aircraftCode">
              <el-input v-model="DialogForm.aircraftCode" placeholder="请输入机号" :maxlength="30" @change="aircraftCodeChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客票号：" prop="cabinLevel">
              <el-input v-model="DialogForm.ticketNo" placeholder="请输入客票号" :maxlength="30" />
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
              <el-select
                v-model="DialogForm.settlementTypeId"
                style="width: 100%"
                clearable
                placeholder="结算类型"
                @change="settlementTypeIdChange"
              >
                <el-option
                  v-for="(item, $index) in settlementOptions"
                  :key="$index"
                  :label="item.label"
                  :value="`${item.value}`"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="12">
            <el-form-item label="卡号：" prop="settlementCardNum">
              <el-input v-model="DialogForm.settlementCardNum" :maxlength="20" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签单人：" prop="signer">
              <el-input v-model="DialogForm.signer" :maxlength="20" placeholder="请输入签单人" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="送登机口：" prop="signer">
              <el-switch
                v-model="DialogForm.deliverDepartureGate"
                :active-value="1"
                :inactive-value="0"
              />
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接待时间：" prop="serveDate">
              <base-date-picker
                v-model="DialogForm.serveDate"
                :clearable="false"
                placeholder="请选择接待时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                @change="serveDateChange"
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
                  <el-input v-model="DialogForm.serveNum" type="number" @change="calcSettleMoney" />
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
                  v-for="(item, $index) in hallOptionsFilterByServiceTypeId"
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务人员：" prop="waiterId">
              <!--<template v-if="isCabin">-->
              <el-select v-model="DialogForm.waiterId" style="width: 100%" clearable placeholder="请输入服务人员">
                <el-option
                  v-for="(item, $index) in waiterOptions"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!--</template>-->
              <!--<template v-else>
                {{ waiters }}
                <el-button @click="waiterDialogVisible = true">
                  选择
                </el-button>
              </template>-->
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
          <el-col :span="12">
            <el-form-item label="备注：" prop="content">
              <el-input v-model="DialogForm.content" :maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col v-if="isRegist" :span="12">
            <el-form-item label="迎接语：" prop="greeting">
              <el-input v-model="DialogForm.greeting" :maxlength="30" placeholder="请输入迎接语" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算金额：" prop="amount">
              <el-input v-model="DialogForm.amount" type="number" placeholder="请输入结算金额">
                <span slot="suffix">
                  元
                </span>
              </el-input>
            </el-form-item>
          </el-col>
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
                      <el-input v-model.trim="scope.row.seatNum" :maxlength="10" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="ticketNo" label="客票号">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.ticketNo" :maxlength="30" />
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
    <!--休息卡-->
    <div ref="relax-card" class="print-container">
      <relax-card :dialog-form="DialogForm" />
    </div>
    <!--珠海机场会员卡支付弹窗-->
    <base-dialog
      title="珠海机场会员卡支付"
      :visible.sync="vipPayDialogVisible"
      width="600px"
      center
      @closed="orderCardDetail = null, vipPayDialogVisible = false, cardNoForm.cardNo = ''"
    >
      <base-form :model="cardNoForm" label-width="120px" confirm-btn-text="确定扣费" :show-default-foot="Boolean(orderCardDetail)" :show-default-btn="cardNoForm.remarks == 1" @submit="vipPay" @cancel="vipPayDialogVisible = false">
        <el-row>
          <el-col :span="12">
            <el-form-item label="旅客姓名">
              {{ dialogForm.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="随行人数">
              {{ (dialogForm.accompanyList || []).length }}人
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务厅房">
              {{ hallName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算金额">
              {{ dialogForm.amount }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-form-item label="会员卡号" prop="cardNo">
          <el-input ref="queryCardInput" v-model="cardNoForm.cardNo" :maxlength="30" placeholder="会员卡号">
            <el-button slot="append" @click="queryCard">
              查询
            </el-button>
          </el-input>
        </el-form-item>
        <template v-if="orderCardDetail">
          <el-divider content-position="left">
            会员卡信息
          </el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="持卡方">
                {{ orderCardDetail.ownerName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办理人身份证">
                {{ orderCardDetail.idNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡面值">
                {{ orderCardDetail.value }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡种类型">
                {{ orderCardDetail.typeName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡余额">
                ￥{{ orderCardDetail.balance }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折扣率">
                {{ orderCardDetail.discountRate }}折
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            结算金额
          </el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单金额">
                ￥{{ orderCardDetail.srcPrice }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折后金额">
                {{ orderCardDetail.remarks == 0 ? '不支持该预订服务': `￥${orderCardDetail.discountPrice}` }}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </base-form>
    </base-dialog>
    <base-dialog
      title="选择服务人员"
      :visible.sync="waiterDialogVisible"
      width="600px"
      center
    >
      <base-checkbox-group
        v-model="waiters"
        :list="waiterOptions"
      />
      <template #footer>
        <el-button type="primary" @click="confirmSelectWaiters">
          确定
        </el-button>
        <el-button @click="cancelSelectWaiters">
          取消
        </el-button>
      </template>
    </base-dialog>
  </div>
</template>
<script>
/* eslint-disable vue/no-side-effects-in-computed-properties,no-unused-vars */

import DictionaryApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import ReceptionApi from '../../../api/module/beTrade/BeTradeReceptionApi'
import CardApi from '../../../api/module/wechat/WechatCardApi'
import ProductOrderApi from '../../../api/module/wechat/WechatProductOrderApi'
import SettlementApi from '../../../api/module/beTrade/BeTradeSettlementApi'
import ReceiveOrgApi from '../../../api/module/beTrade/BeTradeReceiveOrgApi'
import DispatcherScheduleApi from '../../../api/module/beDispatch/BeDispatchDispatcherScheduleApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
import CabinApi from '../../../api/module/beTrade/BeTradeCabinApi'
import FlightDynamicApi from '../../../api/module/beTrade/BeTradeFlightDynamicApi'
import AircraftApi from '../../../api/module/beTrade/BeTradeAircraftApi'
import { validatePhoneOrNull, validateInteger } from '../../../utils/validate/validate-element'
import { validator } from '../../../utils/validate/validate'
import MyWebSocket from '../../../utils/websocket'
import RelaxCard from '../common/RelaxCard'
import BaseDialog from '../../../components/dialog/BaseDialog'
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
  name: 'UpdateDialog',
  components: { BaseDialog, RelaxCard },
  props: {
    value: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    customerTypeOptions: {
      type: Array,
      default: function() {
        return []
      }
    },
    hallOptions: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 类型 判断是哪个页面的弹窗
    // cabin: 两舱   regist:接待登记  reserve: 预约
    page: {
      type: String,
      default: 'cabin'
    }
  },
  data() {
    return {
      waiters: [],
      selectWaiters: [],
      scheduled: null,
      waiterDialogVisible: false,
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
      return this.page === 'cabin'
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
      return this.hallOptions.find(item => item.value === this.dialogForm.hallId)
    },
    settlementTypeIdInSettlementOptions() { // 结算类型列表是否包含当前结算类型id
      return this.settlementOptions.find(item => item.value === this.dialogForm.settlementTypeId)
    },
    dialogFormRules() {
      const baseRules = {
        name: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // companyId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serviceTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serveNum: [{ required: true, trigger: 'change', validator: validateServerNum }],
        allNum: [{ required: true, trigger: 'change', validator: validateServerNum }],
        customerTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // otherServiceTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        mobile: [{ trigger: 'change', validator: validatePhoneOrNull }],
        otherServeNum: [],
        // boardingPassNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // flightCode: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // cabinLevel: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // aircraftCode: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // idCard: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // seatNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // startCity: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        settlementTypeId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // settlementCardNum: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        hallId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // amount: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // orderAmount: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // waiterId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // duration: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serveDate: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      }
      const dynamicRule = this.isRegist ? {} : { hallId: [{ required: true, message: '必填项不能为空', trigger: 'change' }] }
      if (this.dialogForm.otherServiceTypeId) {
        baseRules.otherServeNum = [{ required: true, trigger: 'change', validator: validateServerNum }]
      } else {
        baseRules.otherServeNum = [{ required: false, trigger: 'change' }]
      }
      return {
        ...baseRules, ...dynamicRule
      }
    },
    settlementTypeName() {
      const id = this.dialogForm.settlementTypeId
      return id ? this.settlementOptions.find(item => item.value === id).label : ''
    },
    // 厅房名字
    hallName() {
      const hall = this.hallOptions.find(item => item.value == this.dialogForm.hallId)
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
    },
    isRegist() {
      return this.dialogForm.type == 2
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          for (const condition in this.value) {
            this.$set(this.dialogForm, condition, this.value[condition])
          }
          if (!this.dialogForm.id) {
            this.$set(this.dialogForm, 'serveDate', this.$moment().format('YYYY-MM-DD HH:mm:ss'))
            // 两舱服务，默认不限时；其他的都是，默认2小时
            this.$set(this.dialogForm, 'duration', this.isRegist ? 2 : 0)
            if (this.hallOptionsFilterByServiceTypeId.length === 1 && this.isCabin) {
              this.dialogForm.hallId = this.hallOptionsFilterByServiceTypeId[0].value
              this.hallIdChange(this.dialogForm.hallId)
            }
          }
          // 如果有航班号  没有机号则在查询一次航班信息
          if (this.dialogForm.flightCode && !this.dialogForm.aircraftCode) {
            this.getFlightInfo()
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
    'dialogFormExtend.info': function(newVal) {
      if (newVal && /^(.){18}$/g.test(newVal)) {
        const [boardingPassNum, flightCode, day, seatNum] = newVal.match(/(.{6})(\s\d{2})(.{3}).+/)
        this.addAccompany({ boardingPassNum, flightCode, seatNum })
        this.dialogFormExtend.info = ''
      }
    },
    'dialogForm.serviceTypeId': async function(newVal, oldVal) {
      // 如果是接待登记 厅房跟服务类型联动
      if (this.isRegist) {
        if (newVal) {
          this.hallOptionsFilterByServiceTypeIdIncludeCurrentServiceTypeId ? '' : this.dialogForm.hallId = ''
        } else {
          this.dialogForm.hallId = ''
        }
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
    'dialogForm.hallId': function(newVal, oldVal) {
      this.initWaiterOptions()
    },
    'dialogForm.settlementTypeId': async function(newVal, oldVal) {
      this.initMaxNum()
    },
    'dialogForm.waiterId': function(newVal, oldVal) {
      this.initName(newVal, this.waiterOptions, 'waiterCN')
    },
    'dialogForm.boardingPassNum': function(newVal, oldVal) {
      if (this.checkScanCodeInfo(newVal)) {
        const scanCodeInfo = newVal.trim()
        let day = '';
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
    settlementTypeIdChange() {
      this.initName(this.dialogForm.settlementTypeId, this.settlementOptions, 'settlementCN')
      this.calcSettleMoney()
    },
    serviceTypeIdChange(newVal) {
      this.initName(newVal, this.serviceTypeOptions, 'serviceTypeCN')
      this.calcSettleMoney()
    },
    otherServiceTypeIdChange(newVal) {
      this.calcSettleMoney()
      this.initName(newVal, this.serviceTypeOptions, 'otherServiceTypeCN')
    },
    companyIdChange(newVal) {
      this.calcSettleMoney()
      this.initName(newVal, this.receptUnitOptions, 'companyName')
    },
    hallIdChange(newVal) {
      this.calcSettleMoney()
      this.initName(newVal, this.hallOptions, 'hallCN')
    },
    confirmSelectWaiters() {
      // todo 设置选中的服务人员
      this.waiterDialogVisible = false
    },
    cancelSelectWaiters() {
      // todo 取消设置选中的服务人员
      this.waiterDialogVisible = false
    },
    echoAccompanyFlightInfo(obj) {
      const { boardingPassNum } = obj
      if (this.checkScanCodeInfo(boardingPassNum)) {
        const scanCodeInfo = boardingPassNum.trim()
        let day = '';
        // 登机牌 航班号 座位号
        [obj.boardingPassNum, obj.flightCode, day, obj.seatNum] = scanCodeInfo.match(/(.{6})(\s\d{2})(.{3}).+/)
      }
    },
    async boardingPassNum() {
      if (this.dialogForm.boardingPassNum && this.dialogForm.serveDate) {
        debugger
        this.isCabin ? await CabinApi.boardingPassNum(this.dialogForm) : await ReceptionApi.boardingPassNum(this.dialogForm)
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
      this.hallOptions = this.isRegist ? await HallApi.getOptionsByDatadictId(this.dialogForm.serviceTypeId) : await HallApi.getOptions()
      return true
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
    serveDateChange() {
      this.getFlightInfo()
      this.boardingPassNum()
    },
    getFlightInfo: debounce(async function() {
      if (/^\w{6}$/.test(this.dialogForm.flightCode) && this.dialogForm.serveDate) {
        const res = await FlightDynamicApi.getFlightDynamic({ flightCode: this.dialogForm.flightCode, date: this.dialogForm.serveDate })
        const { aircraftCode, from_Cn, to_Cn } = res.data
        this.dialogForm.startCity = `${from_Cn}/${to_Cn}`
        this.$set(this.dialogForm, 'aircraftCode', aircraftCode)
        this.aircraftCodeChange()
      }
    }),
    async getAirline(airlineCode) {
      airlineCode = airlineCode || this.dialogForm.aircraftCode
      this.calcSettleMoney()
      const res = await AircraftApi.getFlightCompanyByAirlineCode(airlineCode)
      const { airline } = res.data
      this.dialogForm.airline = airline
    },
    async queryCard() {
      if (this.cardNoForm.cardNo) {
        const data = {
          datadictId: this.isRegist ? this.dialogForm.serviceTypeId : 17,
          // proId: '',
          cardNum: this.cardNoForm.cardNo,
          price: this.dialogForm.orderAmount,
          num: this.isCabin ? (this.dialogForm.accompanyList || []).length + 1 : this.dialogForm.serveNum,
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
      const condition1 = this.dialogForm.settlementTypeId
      // 接待登记不必选择厅房
      const condition2 = this.dialogForm.hallId || this.isRegist
      // 非接待登记必须有服务人数并且小于100
      const condition3 = (this.dialogForm.serveNum && regex_serverNum.test(this.dialogForm.serveNum)) || !this.isRegist
      // 如果选了其它服务 其它服务人数小于100
      const condition4 = this.dialogForm.otherServiceTypeId && regex_serverNum.test(this.dialogForm.otherServeNum) || !this.dialogForm.otherServiceTypeId
      return condition1 && condition2 && condition3 && condition4
    },
    async calcSettleMoney() { // 计算结算金额
      if (this.dialogForm.orderId || this.dialogForm.secReviewStatus == 1) {
        console.log('小程序下单或财务已审核不用调用计算金额接口')
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
    aircraftCodeChange(newVal) {
      this.getAirline(newVal)
    },
    getCalcSettleMoneyData() { // 获取算钱数据
      // 两舱 所需字段flightCode customerTypeId  settlementTypeId hallId peopleNum
      // 接待登记 所需字段 companyId customerTypeId hallId peopleNum
      // 预约计算 所需字段 hallId peopleNum
      // datadictId 服务类型(id) isJJ 是否接机服务：0不是1是
      const peopleNum = this.dialogForm.accompanyList.length + 1
      const data = {
        companyId: this.dialogForm.companyId,
        hallId: this.dialogForm.hallId,
        customerTypeId: this.dialogForm.customerTypeId,
        // peopleNum: peopleNum,
        datadictId: this.isRegist ? this.dialogForm.serviceTypeId : 17,
        otherService: this.dialogForm.otherServiceTypeId,
        serveNum: (this.isCabin || this.dialogForm.type == 1) ? peopleNum : this.dialogForm.serveNum,
        otherServeNum: this.dialogForm.otherServeNum || 0,
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
        //   settlementTypeId: this.dialogForm.settlementTypeId
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
      this.$parent.printRecepits(this.dialogForm.id)
    },
    // 打印休息卡
    async printRelaxCard() {
      this.initName(this.dialogForm.settlementTypeId, this.settlementOptions, 'settlementCN')
      this.$nextTick(_ => this.$print(this.$refs['relax-card']))
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
      this.customerTypeOptions = await DictionaryApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.CUSTOMER_TYPE)
    },
    async initWaiterOptions() {
      const currentFormHall = this.hallOptions.filter(item => item.value === this.dialogForm.hallId)[0]
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
      this.isCabin && this.calcSettleMoney()
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
      this.isCabin && this.calcSettleMoney()
    },
    submit(force) {
      // 判断如果是珠海会员卡就支付弹窗   修改 不区分
      //  珠海机场会员卡  id   9
      if (this.settlementTypeName === '珠海机场会员卡' && !force && !this.dialogForm.id) {
        this.vipPayDialogVisible = true
      } else {
        if (this.dialogForm.accompanyList.length > this.maxNum) {
          this.dialogForm.accompanyList.splice(this.maxNum)
        }
        this.initName(this.dialogForm.settlementTypeId, this.settlementOptions, 'settlementCN')
        const data = this.getSubmitData()
        this.$emit('input', data)
        this.$emit('submit', data)
      }
    },
    getSubmitData() {
      const data = { ...this.dialogForm }
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
      this.dialogForm.amount = this.orderCardDetail.discountPrice
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
