<!--两舱服务  接待登记 记录复核弹窗-->
<template>
  <div>
    <!--弹窗内容-->
    <base-dialog
      title="详情"
      :visible.sync="Mixins_$DialogVisible"
      width="1200px"
      center
      @closed="$emit('closed')"
    >
      <base-form ref="form" :model="DialogForm" label-width="120px" :show-default-foot="false">
        <!--预约信息  begin-->
        <template v-if="isReserveDetail">
          <el-row>
            <el-divider content-position="left">
              <span class="dialog-form-title">预约信息</span>
            </el-divider>
            <el-col :span="12">
              <el-form-item label="预约人/单位：" prop="orderBy">
                {{ dialogForm.orderBy }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="contactPhone">
                {{ dialogForm.contactPhone }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预约日期：" prop="appointmentDate">
                {{ dialogForm.appointmentDate }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时间：" prop="timeRange">
                {{ dialogForm.appointmentStartTime }}~{{ dialogForm.appointmentEndTime }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="接送车牌号：" prop="licensePlateNumber">
                {{ dialogForm.licensePlateNumber }}
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">-->
            <!--<el-form-item label="预约人数：" prop="people">-->
            <!--<el-input v-model.number="dialogForm.people" placeholder="请输入预约人数" type="number" />-->
            <!--</el-form-item>-->
            <!--</el-col>-->
          </el-row>
        </template>
        <!--预约信息  end-->
        <!--旅客信息  begin-->
        <el-row>
          <el-divider content-position="left">
            <span class="dialog-form-title">旅客信息</span>
          </el-divider>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              {{ dialogForm.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="idCard">
              {{ dialogForm.idCard }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobile">
              {{ dialogForm.mobile }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务：" prop="job">
              {{ dialogForm.job }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登机牌：" prop="boardingPassNum">
              {{ dialogForm.boardingPassNum }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航班号：" prop="flightCode">
              {{ dialogForm.flightCode }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发/到达：" prop="startCity">
              {{ dialogForm.startCity }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航空公司：" prop="airline">
              {{ dialogForm.airline }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座位号：" prop="seatNum">
              {{ dialogForm.seatNum }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="舱位：" prop="cabinLevel">
              {{ dialogForm.cabinLevel }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机号：" prop="aircraftCode">
              {{ dialogForm.aircraftCode }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客票号：" prop="cabinLevel">
              {{ dialogForm.ticketNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户类型：" prop="customerTypeId">
              {{ dialogForm.customerTypeCN }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算类型：" prop="settlementTypeId">
              {{ dialogForm.settlementCN }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接待单位：" prop="companyId">
              {{ dialogForm.companyName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡号：" prop="settlementCardNum">
              {{ dialogForm.settlementCardNum }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签单人：" prop="signer">
              {{ dialogForm.signer }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送登机口：" prop="signer">
              <el-switch
                v-model="dialogForm.deliverDepartureGate"
                disabled
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="isHallDetail" :span="12">
            <el-form-item label="接待时间：" prop="serveDate">
              {{ dialogForm.serveDate }}
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
            <el-col :span="12">
              <el-form-item label="服务类型：" prop="serviceTypeId">
                {{ dialogForm.serviceTypeCN }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接待人数：">
                {{ dialogForm.serveNum }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总接待人数：">
                {{ dialogForm.allNum }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他服务：" prop="otherServiceTypeId">
                {{ dialogForm.otherServiceTypeCN }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他服务人数：">
                {{ dialogForm.otherServeNum }}
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="服务厅房：" prop="hallId">
              {{ dialogForm.hallCN }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务时长：" prop="duration">
              {{ dialogForm.duration || '-' }}小时
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务人员：" prop="waiterId">
              {{ dialogForm.waiterCN }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单金额：" prop="orderAmount">
              {{ dialogForm.orderAmount }}元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" prop="content">
              {{ dialogForm.content }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算金额：" prop="amount">
              {{ dialogForm.amount }}元
            </el-form-item>
          </el-col>

          <template v-if="isRegist">
            <el-col :span="12">
              <el-form-item label="迎接语：" prop="greeting">
                {{ dialogForm.greeting }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="全流程保障：">
                <el-switch
                  v-model="dialogForm.ensuranceType"
                  disabled
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <!--服务信息 end-->
        <!--随行信息 begin-->
        <template>
          <el-row>
            <el-divider content-position="left">
              <span class="dialog-form-title">随行信息</span>
            </el-divider>
            <el-col :span="24">
              <el-form-item label="随行人员：">
                <el-table
                  :data="dialogForm.accompanyList"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" />
                  <el-table-column prop="name" label="姓名" />
                  <el-table-column prop="idCard" label="身份证号" />
                  <el-table-column prop="boardingPassNum" label="登机牌" />
                  <el-table-column prop="flightCode" label="航班号" />
                  <el-table-column prop="cabinLevel" label="舱位" />
                  <el-table-column prop="seatNum" label="座位号" />
                  <el-table-column prop="ticketNo" label="客票号" />
                  <el-table-column label="操作" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <!--随行信息 end-->
        <slot name="footer" />
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
/* eslint-disable vue/no-side-effects-in-computed-properties,no-unused-vars */

export default {
  name: 'UpdateDialogText',
  props: {
    type: {
      type: String,
      default: 'hall-detail'
    },
    dialogForm: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    // 2接待登记 1 两舱
    isCabin: function() {
      return this.dialogForm.type == 1
    },
    isRegist: function() {
      return this.dialogForm.type == 2
    },
    isHallDetail: function() {
      return this.type === 'hall-detail'
    },
    isReserveDetail: function() {
      return this.type === 'reserve-detail'
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
