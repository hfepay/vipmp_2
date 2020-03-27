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
          <el-form-item label="订单号：">
            <el-input v-model="queryParams.id" placeholder="请输入订单号" />
          </el-form-item>
          <el-form-item label="产品类型：">
            <el-select v-model="queryParams.typeId" clearable placeholder="请输入交易类型">
              <el-option
                v-for="(item, $index) in productTypeOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="预订方类型：">
            <el-select v-model="queryParams.orderType" clearable placeholder="请输入预订方类型">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.reserverType)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="预订日期：">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="下单时间：">
            <base-date-picker
              v-model="queryParams.orderTimeRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="queryParams.status" clearable placeholder="请输入订单状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.orderStatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称：">
            <el-select v-model="queryParams.productId" clearable placeholder="请选择产品名称">
              <el-option
                v-for="(item, $index) in productNameOptions"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="预订方名称：">
            <el-input v-model="queryParams.name" placeholder="请输入持卡方名称" />
          </el-form-item>
          <!-- <el-form-item label="预订时间段：">
            <el-date-picker
              v-model="queryParams.reserveTimeRange"
              value-format="HH:mm"
              type="timerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>-->
          <el-form-item label="联系电话：">
            <el-input v-model="queryParams.mobile" placeholder="请输入联系电话" />
          </el-form-item>

          <el-form-item label="支付方式：" prop="payType">
            <el-select v-model="queryParams.payType" clearable placeholder="请选择支付方式" style="width: 100%">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.payType)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!--<el-form-item label="会员卡种：">-->
          <!--<el-select v-model="queryParams.cardType" clearable placeholder="请输入会员卡种">-->
          <!--<el-option-->
          <!--v-for="(item, $index) in cardOptions"-->
          <!--:key="$index"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--/>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="办理人身份证：">-->
          <!--<el-input v-model="queryParams.idCard" placeholder="请输入办理人身份证" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="卡号：">-->
          <!--<el-input v-model="queryParams.cardNo" placeholder="请输入卡号" />-->
          <!--</el-form-item>-->
          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="Mixins_$Edit(scope.row)">
          查看
        </el-button>
        <template v-if="scope.row.status == 1">
          <!--待支付按钮-->
          <el-button type="primary" @click.stop="pay(scope.row)">
            支付
          </el-button>
          <el-button type="danger" @click.stop="cancelOrder(scope.row)">
            取消订单
          </el-button>
        </template>
        <template v-if="scope.row.status == 3">
          <!--支付成功-->
          <el-button type="danger" @click.stop="refund(scope.row)">
            退款
          </el-button>
          <!--<el-button type="primary" @click.stop="regist(scope.row)">
            接待登记
          </el-button>-->
        </template>
      </template>
    </base-table-layout>
    <!--查看弹窗-->
    <base-dialog
      :title="dialogForm.operateType === 'regist'? '接待登记': '查看'"
      :visible.sync="Mixins_$DialogVisible"
      width="900px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form :model="DialogForm" :rules="dialogFormRules" :show-default-foot="dialogForm.operateType === 'regist'" confirm-btn-text="接待登记" label-width="120px" @submit="toRegistPage" @cancel="Mixins_$DialogVisible = false">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号：">
              {{ dialogForm.id }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下单时间：">
              {{ dialogForm.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品类型：">
              {{ dialogForm.typeName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称：">
              {{ dialogForm.productName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预订方类型：">
              {{ dialogForm.orderType | reserverTypeFilter }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预订方名称：">
              {{ dialogForm.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              {{ dialogForm.mobile }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预约日期：">
              {{ dialogForm.orderDate }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预约时间段：">
              {{ dialogForm.startTime }}-{{ dialogForm.endTime }}
            </el-form-item>
          </el-col>
          <el-col v-for="(item, $index) in dialogForm.people" :key="$index" :span="12">
            <el-form-item :label="`被接待人${$index + 1}`">
              姓名:{{ item.name }},航班号:{{ item.flightCode }},车牌号:{{ item.licensePlate }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：">
              {{ dialogForm.remarks }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单价格：">
              {{ dialogForm.price }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际支付：">
              {{ dialogForm.pay }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交易订单号：">
              {{ dialogForm.payId }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付类型：">
              {{ dialogForm.payType | payTypeFilter }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员卡类型：">
              {{ dialogForm.cardType }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会卡号：">
              {{ dialogForm.cardNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态：">
              {{ dialogForm.status | orderStatusFilter }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogForm.operateType === 'regist'">
          <el-form-item label="登记位置：" prop="registType">
            <el-radio-group v-model="DialogForm.registType">
              <el-radio v-for="(item, $index) in registTypeList" :key="$index" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </base-form>
    </base-dialog>
    <!--支付弹窗-->
    <base-dialog
      title="支付"
      :visible.sync="payDialogVisible"
      width="700px"
      center
      @closed="resetPayDialogForm"
    >
      <base-form :model="payDialogForm" :rules="payDialogFormRules" confirm-btn-text="确定扣费" :show-default-btn="payDialogForm.remarks == 1" label-width="120px" @submit="submitPayDialogForm" @cancel="payDialogVisible = false">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号：">
              {{ payDialogForm.id }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单价格：">
              {{ payDialogForm.price }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预订方名称：">
              {{ payDialogForm.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              {{ payDialogForm.mobile }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品类型：">
              {{ payDialogForm.typeName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称：">
              {{ payDialogForm.productName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预订日期：">
              {{ payDialogForm.orderDate }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预订时间段：">
              {{ payDialogForm.timeRange }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="支付方式：" prop="payType">
              <el-select v-model="payDialogForm.payType" clearable placeholder="请选择支付方式" style="width: 100%">
                <el-option
                  v-for="(item, $index) in $Contants.toOptions($Contants.payType)"
                  :key="$index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="payDialogForm.payType == 3" :span="24">
            <el-form-item label="会员卡号：" prop="cardNo">
              <el-input v-model="payDialogForm.cardNo" placeholder="请输入会员卡号">
                <template slot="append">
                  <el-button type="primary" @click="queryVipCard">
                    查询
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-else :span="24">
            <el-form-item label="支付金额：" prop="pay">
              <el-input v-model="payDialogForm.pay" type="number" placeholder="请输入支付金额" />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="vipCardInfo">
          <el-row>
            <el-divider content-position="left">
              <span class="dialog-form-title">会员卡信息</span>
            </el-divider>
            <el-col :span="12">
              <el-form-item label="持卡方：">
                {{ vipCardInfo.ownerName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办理人身份证：">
                {{ vipCardInfo.idNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡面值：">
                {{ vipCardInfo.value }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡种类型：">
                {{ vipCardInfo.typeName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡余额：">
                ￥{{ vipCardInfo.balance }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折扣率：">
                {{ vipCardInfo.discountRate }}折
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-divider content-position="left">
              <span class="dialog-form-title">订单金额</span>
            </el-divider>
            <el-col :span="12">
              <el-form-item label="订单价格：">
                ￥{{ vipCardInfo.srcPrice }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折后价格：">
                {{ vipCardInfo.remarks == 0 ? '不支持该预订服务': `￥${vipCardInfo.discountPrice}` }}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatProductOrderApi'
import CardApi from '@/api/module/wechat/WechatCardApi'
import CardTypeApi from '@/api/module/wechat/WechatCardTypeApi'
import SettlementApi from '@/api/module/beTrade/BeTradeSettlementApi'
import ProductTypeApi from '../../../api/module/wechat/WechatProductTypeApi'
import ProductApi from '../../../api/module/wechat/WechatProductApi'
export default {
  name: 'OrderRecord',
  mixins: [Mixins],
  data() {
    return {
      timeRangeToCamelCase: true,
      vipCardInfo: null,
      productNameOptions: [],
      productTypeOptions: [],
      settlementOptions: [],
      cardOptions: [],
      ApiObject,
      payDialogVisible: false,
      payDialogForm: {
        id: '',
        price: '',
        name: '',
        mobile: '',
        typeName: '',
        productName: '',
        orderDate: '',
        timeRange: '',
        payType: '',
        cardNo: '',
        pay: ''
      },
      payDialogFormRules: {
        payType: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        cardNo: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        pay: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      registTypeList: [
        { label: '接待登记-登记录入', value: '/serverCenter/regist' },
        { label: '两舱服务-两舱登记', value: '/serverCenter/cabin' }
      ],
      dialogForm: {
        registType: '',
        payId: '',
        area: '',
        seatQuantities: '',
        place: '',
        type: '',
        productName: '',
        orderType: '',
        startTime: '',
        endTime: '',
        orderDate: '',
        timeRange: '',
        name: '',
        mobile: '',
        flightCode: '',
        greeting: '',
        people: [],
        remarks: '',
        price: '',
        pay: '',
        payType: '',
        createTime: '',
        status: ''
      },
      dialogFormRules: {
        registType: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '订单号', prop: 'id' },
        { label: '交易订单号', prop: 'dealId' },
        { label: '产品类型', prop: 'typeName' },
        { label: '产品名称', prop: 'productName' },
        { label: '预订方类型', prop: 'orderType', format: this.$Contants.reserverType },
        { label: '预订方名称', prop: 'name' },
        { label: '联系电话', prop: 'mobile' },
        { label: '预订日期', prop: 'orderDate' },
        { label: '预订时间段', prop: 'timeRange' },
        { label: '订单价格', prop: 'price' },
        { label: '实际支付', prop: 'pay' },
        { label: '支付方式', prop: 'payType', format: this.$Contants.payType },
        { label: '下单时间', prop: 'createTime' },
        { label: '订单状态', prop: 'status', format: this.$Contants.orderStatus },
        { label: '操作', slot: 'operator', width: 240 }
      ],
      queryParams: {
        id: '',
        typeName: '',
        orderType: '',
        timeRange: [],
        orderTimeRange: [],
        reserveTimeRange: [],
        status: '',
        productName: '',
        name: '',
        mobile: '',
        payType: ''
      }
    }
  },
  methods: {
    toRegistPage() {
      this.Mixins_$DialogVisible = false
      this.$router.push({ path: `${this.dialogForm.registType}?reserveId=${this.dialogForm.id}&origin=order` })
    },
    async regist(obj) {
      await this.edit(obj)
      this.$set(this.dialogForm, 'operateType', 'regist')
    },
    getFinalQueryParams(queryParams) {
      if (queryParams.startTime) {
        queryParams.startDate = queryParams.startTime
        delete queryParams.startTime
      }
      if (queryParams.endTime) {
        queryParams.endDate = queryParams.endTime
        delete queryParams.endTime
      }
      if (queryParams.orderTimeRange) {
        queryParams.createStartTime = queryParams.orderTimeRange[0]
        queryParams.createEndTime = queryParams.orderTimeRange[1]
        delete queryParams.orderTimeRange
      }
      if (queryParams.reserveTimeRange) {
        queryParams.startTime = queryParams.reserveTimeRange[0]
        queryParams.endTime = queryParams.reserveTimeRange[1]
        delete queryParams.reserveTimeRange
      }
      return queryParams
    },
    async submitPayDialogForm() {
      const { id, payType, pay, srcType } = this.payDialogForm
      const data = {
        id, payType, pay, srcType,
        type: 0
      }
      // 如果是会员卡支付 还需要cardId cardNo
      if (`${payType}` === '3') {
        if (!this.vipCardInfo) {
          this.$message.error('请先查询会员信息')
          return
        }
        data.cardId = this.vipCardInfo.id
        data.cardNo = this.payDialogForm.cardNo
        data.pay = this.vipCardInfo.discountPrice
      }
      const res = await ApiObject.pay(data)
      this.$message.success(res.message)
      this.payDialogVisible = false
      this.init()
    },
    createdAspectBefore() {
      this.initSettlementOptions()
      this.initCardOptions()
      this.initProductTypeOptions()
      this.initProductNameOptions()
    },
    async initProductNameOptions() {
      this.productNameOptions = await ProductApi.getOptions()
    },
    async initProductTypeOptions() {
      this.productTypeOptions = await ProductTypeApi.getOptions()
    },
    async initSettlementOptions() {
      this.settlementOptions = await SettlementApi.getOptions()
    },
    async initCardOptions() {
      this.cardOptions = await CardTypeApi.getOptions()
    },
    async queryVipCard() {
      if (this.payDialogForm.cardNo) {
        const data = {
          datadictId: this.payDialogForm.datadictId,
          proId: this.payDialogForm.proId,
          cardNum: this.payDialogForm.cardNo,
          price: this.payDialogForm.price,
          num: this.payDialogForm.num,
          srcType: this.payDialogForm.srcType,
          hallId: this.payDialogForm.hallId
        }
        const res = await CardApi.orderCardDetail(data)
        this.vipCardInfo = res.data
      } else {
        this.$message.error('请输入卡号')
      }
    },
    resetPayDialogForm() {
      this.payDialogForm = this.$utils.reset(this.payDialogForm)
      this.vipCardInfo = null
    },
    async pay(obj) {
      this.payDialogForm = { ...obj }
      this.payDialogVisible = true
    },
    async cancelOrder(obj) {
      await this.$confirm('确认取消订单?', '取消订单')
      const res = await ApiObject.cancel(obj.id)
      this.$message.success(res.message)
      this.init()
    },
    async refund(obj) {
      const { payType, pay } = obj
      await this.$confirm(`对方使用的是${this.$Contants.payType[payType]}支付，确认退款${pay}元?`, '确定退款')
      const res = await ApiObject.pay(obj)
      this.$message.success(res.message)
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
