<template>
  <div class="hf-container" style="display: flex">
    <div class="card-container">
      <div v-for="(item, $index) in dispatchStatHallList" :key="$index" class="right-card" :class="{'full': item.serveCount >= item.capacity}" @click="showHall(item)">
        <span>{{ item.name }}</span>
        <span>当前旅客人数:{{ item.serveCount>item.capacity?item.capacity: item.serveCount }}({{ item.capacity }})</span>
      </div>
    </div>
    <div style="width: calc(100% - 200px)">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>贵宾调度航班保障</span>
          <div style="float: right; padding: 3px 0">
            <el-checkbox-group v-model="queryParams.status" style="display: inline-block" @change="init">
              <el-checkbox true-label="1" false-label="0">
                显示已起飞航班
              </el-checkbox>
            </el-checkbox-group>
            <el-button type="text" style="margin-left: 30px" @click="showDispatchTask">
              调度任务(已完成：{{ taskCompletedNumber }}，未完成：{{ taskUnCompletedNumber }})
            </el-button>
          </div>
        </div>
        <div>
          <!--table模板-->
          <base-table-layout
            style="z-index: 9"
            :pagination="false"
            :headers="dispatchStatTaskHeaders"
            :data="dispatchStatTaskList"
            @row-click="showFlight"
          >
            <template slot="operator" slot-scope="{scope}">
              <el-button @click.stop="sendBoardingNotify(scope.row)">
                发送引领通知
              </el-button>
            </template>
            <template slot="leadingNotify" slot-scope="{scope}">
              <div :class=" scope.row.firstWarned && scope.row.leadingNotify === '通知未确认' ? 'danger-text':''">
                {{ scope.row.leadingNotify }}
              </div>
            </template>
            <template slot="boardingNotify" slot-scope="{scope}">
              <div :class=" scope.row.secondWarned && scope.row.boardingNotify === '通知未确认' ? 'danger-text':''">
                {{ scope.row.boardingNotify }}
              </div>
            </template>
            <template slot="onceNotify" slot-scope="{scope}">
              <div :class=" scope.row.onceWarned && scope.row.onceNotify === '通知未确认' ? 'danger-text':''">
                {{ scope.row.onceNotify }}
              </div>
            </template>
          </base-table-layout>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>航班接机保障</span>
        </div>
        <div>
          <!--table模板-->
          <base-table-layout
            :pagination="false"
            :headers="flightPickupHeaders"
            :data="pickupList"
            @row-click="showPickupPassenger"
          >
            <template slot="firstNotify" slot-scope="{scope}">
              <div :class=" scope.row.firstWarned && scope.row.firstNotify === '通知未确认' ? 'danger-text':''">
                {{ scope.row.firstNotify }}
              </div>
            </template>
            <template slot="secondNotify" slot-scope="{scope}">
              <div :class=" scope.row.secondWarned && scope.row.secondNotify === '通知未确认' ? 'danger-text':''">
                {{ scope.row.secondNotify }}
              </div>
            </template>
          </base-table-layout>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>公务机及政要调度航班保障</span>
        </div>
        <div>
          <!--table模板-->
          <base-table-layout
            :pagination="false"
            :page-obj="Mixins_$PageObj"
            :headers="dispatchStatJobHeaders"
            :data="overallList"
            @row-click="showWork"
          >
            <template slot="table">
              <base-table
                :data="overallList"
                @row-click="showWork"
              >
                <el-table-column
                  type="index"
                  label="序号"
                />
                <el-table-column
                  prop="id"
                  label="作业编号"
                />
                <el-table-column
                  prop="flightNo"
                  label="航班号"
                />
                <el-table-column
                  prop="etd"
                  label="预计起飞"
                />
                <el-table-column
                  prop="eta"
                  label="预计到场"
                />
                <el-table-column
                  prop="ata"
                  label="到场通报"
                />
                <el-table-column
                  prop="boardingGate"
                  label="登机口"
                />
                <el-table-column
                  prop="headcount"
                  label="总人数"
                />
                <el-table-column
                  prop="serviceStart"
                  width="100px"
                  label="开始"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.serviceStart">
                      {{ scope.row.serviceStart }}
                    </template>
                    <el-button v-else type="primary" @click.stop="confirmFinish(scope.row, 'serviceStart', '开始')">
                      确认完成
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100px"
                  type="loungeReady"
                  label="厅房准备"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.loungeReady">
                      {{ scope.row.loungeReady }}
                    </template>
                    <el-button v-else-if="scope.row.serviceStart" type="primary" @click.stop="confirmFinish(scope.row, 'loungeReady', '厅房准备')">
                      确认完成
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  type="infoConfirm"
                  width="100px"
                  label="信息核对"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.infoConfirm">
                      {{ scope.row.infoConfirm }}
                    </template>
                    <el-button v-else-if="scope.row.loungeReady" type="primary" @click.stop="confirmFinish(scope.row, 'infoConfirm', '信息核对')">
                      确认完成
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  v-for="(item, $index) in dispatchStatJobHeaderObj.complexHeaders"
                  :key="$index"
                  :label="item.label"
                  align="center"
                >
                  <el-table-column
                    v-for="(children, $chiIndex) in item.children"
                    :key="'chi'+$chiIndex"
                    width="100px"
                    :label="children.label"
                    :prop="children.prop"
                  >
                    <template
                      slot-scope="scope"
                    >
                      <template v-if="$chiIndex !== 0">
                        {{ scope.row[children.prop] }}
                      </template>
                      <template v-else>
                        {{ scope.row[children.prop] }}
                        <el-button
                          v-if="!scope.row[children.foreignKey]"
                          type="primary"
                          @click.stop="selectReserveTime(scope.row,children.prop)"
                        >
                          {{ scope.row[children.prop]?'修改':'选择' }}时间
                        </el-button>
                      </template>
                    </template>
                  </el-table-column>
                </el-table-column>
              </base-table>
            </template>

            <!--<template slot="serviceStart" slot-scope="{scope}">
              <template v-if="scope.row.serviceStart">
                {{ scope.row.serviceStart }}
              </template>
              <el-button v-else type="primary" @click.stop="confirmFinish(scope.row, 'serviceStart', '开始')">
                确认完成
              </el-button>
            </template>
            <template slot="loungeReady" slot-scope="{scope}">
              <template v-if="scope.row.loungeReady">
                {{ scope.row.loungeReady }}
              </template>
              <el-button v-else-if="scope.row.serviceStart" type="primary" @click.stop="confirmFinish(scope.row, 'loungeReady', '厅房准备')">
                确认完成
              </el-button>
            </template>
            <template slot="infoConfirm" slot-scope="{scope}">
              <template v-if="scope.row.infoConfirm">
                {{ scope.row.infoConfirm }}
              </template>
              <el-button v-else-if="scope.row.loungeReady" type="primary" @click.stop="confirmFinish(scope.row, 'infoConfirm', '信息核对')">
                确认完成
              </el-button>
            </template>
            <template
              v-for="(item, $index) in selectTimeKeyArr"
              :slot="item"
              slot-scope="{scope}"
            >
              <template v-if="scope.row[item]">
                {{ scope.row[item] }}
              </template>
              <el-button v-else type="primary" @click.stop="selectReserveTime(scope.row,item)">
                选择时间
              </el-button>
            </template>-->
          </base-table-layout>
        </div>
      </el-card>
    </div>
    <!--航班状态弹窗-->
    <base-dialog
      :visible.sync="flightVisible"
      :title="`航班号：${flightDialogForm.flightCode} 起飞时间:${flightDialogForm.flightDate}`"
      width="80%"
      @closed="resetFlightDialogForm"
    >
      <base-form ref="flightDialogForm" :model="flightDialogForm" :rules="flightDialogFormRules" alias="flightDialogForm" label-width="90px" @submit="submitFlightDialogForm" @cancel="flightVisible = false">
        <el-form-item label-width="0">
          <base-table :data="flightList">
            <el-table-column prop="loungeName" label="所在厅房" />
            <el-table-column prop="headcount" label="人数" />
            <el-table-column prop="leadingNotify" label="引领通知" />
            <el-table-column prop="boardingNotify" label="登机通知" />
            <el-table-column prop="onceNotify" label="手动引领通知" />
          </base-table>
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="车辆预约:" prop="vehicleReserve">
              <el-time-picker v-model="flightDialogForm.vehicleReserve" :picker-options="pickerOptions" value-format="HH:mm" placeholder="车辆预约时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车辆到达:" prop="vehicleArrive">
              <el-time-picker v-model="flightDialogForm.vehicleArrive" :picker-options="pickerOptions" value-format="HH:mm" placeholder="车辆到达时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="安检通知:" prop="checkNotify">
              <el-time-picker v-model="flightDialogForm.checkNotify" :picker-options="pickerOptions" value-format="HH:mm" placeholder="安检通知时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="安检到达:" prop="checkArrive">
              <el-time-picker v-model="flightDialogForm.checkArrive" :picker-options="pickerOptions" value-format="HH:mm" placeholder="安检到达时间" />
            </el-form-item>
          </el-col>
        </el-row>
      </base-form>
    </base-dialog>
    <!--发起调度弹窗-->
    <dispatch-dialog v-model="DialogForm" :dialog-visible="dialogVisible" @closed="Mixins_$DialogVisible = false" />
    <!--作业状态弹窗-->
    <base-dialog
      title="作业状态"
      :visible.sync="workVisible"
      width="700px"
    >
      <base-form :model="workDialogForm" :show-default-foot="false" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业编号：">
              {{ workDialogForm.id }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全流程保障：">
              <el-switch inactive-color="#20dc20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旅客姓名：">
              {{ workDialogForm.passengerName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户类型：">
              {{ workDialogForm.custType }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航班号：">
              {{ workDialogForm.flightNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计起飞/到达时间：">
              {{ workDialogForm.etd }}-{{ workDialogForm.eta }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登机口：">
              {{ workDialogForm.boardingGate }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务厅房：">
              {{ workDialogForm.loungeName }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              {{ workDialogForm.notes }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配手持：">
              {{ workDialogForm.assignHandsetName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：">
              {{ workDialogForm.status | dispatchTaskStatusFilter }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <div class="timeline-container">
                <div class="timeline-item">
                  <span class="timeline-item-label">安检预约:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.secureNotify || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">安检到达:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.secureArrive || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">保安预约:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.terminalDoor1 || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">保安到达:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.terminalDoor2 || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">监护预约:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.survilnNotify || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">监护到达:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.survilnArrive || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">行李搬运预约:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.lungageAppoint || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">行李搬运到达:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.lungageArrive || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">车辆预约:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.carAppoint || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">车辆到达:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.carArrive || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">登机完成预约:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.boardingNotify || '-:-' }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-item-label">登机完成到达:</span>
                  <span class="timeline-item-timestamp">{{ workDialogForm.boardingConfirm || '-:-' }}</span>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </base-form>
    </base-dialog>
    <!--厅房状态弹窗-->
    <base-dialog
      :visible.sync="hallVisible"
      :title="`厅房：${hallDialogForm.name} 旅客人数:${ hallDialogForm.serveList.length} 座位总数:${hallDialogForm.capacity}`"
      width="60%"
    >
      <base-form :model="hallDialogForm" :show-default-foot="false" label-width="80px">
        <el-form-item label-width="0">
          <base-table :data="hallDialogForm.serveList">
            <el-table-column prop="flightCode" label="航班号" />
            <el-table-column prop="etd" label="预计起飞时间" />
            <el-table-column prop="boardingGate" label="登机口" />
            <el-table-column prop="passengerName" label="旅客姓名" />
            <el-table-column prop="cabin" label="舱位" />
            <el-table-column prop="seat" label="座位" />
            <el-table-column prop="attendant" label="服务人员" />
          </base-table>
        </el-form-item>
        <el-form-item label="服务人员:">
          {{ (hallDialogForm.attendantList || []).toLocaleString() }}
        </el-form-item>
      </base-form>
    </base-dialog>
    <!--航班接机保障列表-->
    <base-dialog
      :visible.sync="pickupVisible"
      :title="`航班号：${pickupDialogForm.flightCode} 到达时间:${pickupDialogForm.flightDate}`"
      width="80%"
    >
      <base-table ref="pickupDialogForm" :data="pickupPassengerList">
        <el-table-column prop="passengerName" label="旅客姓名" />
        <el-table-column prop="cabin" label="舱位" />
        <el-table-column prop="seat" label="座位" />
        <el-table-column prop="loungeName" label="所在厅房" />
        <el-table-column prop="settlementType" label="结算类型" />
        <el-table-column prop="attendant" label="服务人员" />
        <el-table-column prop="firstNotify" label="第一次通知" />
        <el-table-column prop="secondNotify" label="第二次通知" />
      </base-table>
    </base-dialog>
    <!--调度任务列表-->
    <base-dialog
      :visible.sync="dispatchTaskVisible"
      title="任务状态"
      width="80%"
    >
      <base-table :data="dispatchTaskList">
        <el-table-column prop="id" label="任务编号" />
        <el-table-column prop="taskTypeName" label="任务类型" />
        <el-table-column prop="flightNo" label="航班号" />
        <el-table-column prop="passengerName" label="旅客姓名" />
        <el-table-column prop="notes" label="备注" />
        <el-table-column prop="assignAttendant" label="分配服务人员" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | dispatchTaskStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="rogerTime" label="接收时间" />
        <el-table-column prop="accomplishTime" label="完成时间" />
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            &lt;!&ndash;状态值为0 1才显示&ndash;&gt;
            <el-button v-if="/^[01]$/.test(scope.row.status)" type="primary" @click="cancelTask(scope.row, scope.$index)">
              取消
            </el-button>
          </template>
        </el-table-column>-->
      </base-table>
    </base-dialog>
    <!--预警提示弹窗-->
    <div class="alert-prompt-container">
      <div v-for="(item, $index) in alertPromptList" :key="$index" class="alert-prompt-item">
        <span class="alert-prompt-item-title"> 预警提示:</span><span style="margin-right: 25px" v-html="item.context" /><el-link type="primary" @click.prevent="delAlertPromp(item, $index)">
          我知道了
        </el-link>
      </div>
    </div>
    <!--发送登记通知弹窗-->
    <!--调度任务列表-->
    <base-dialog
      :visible.sync="sendBoardingNotifyVisible"
      title="发送引领通知"
      width="400px"
    >
      <base-form
        :model="sendBoardingNotifyForm"
        :rules="sendBoardingNotifyFormRules"
        label-width="120px"
        @submit="submitSendBoardingNotifyForm"
        @cancel="sendBoardingNotifyVisible = false"
      >
        <el-form-item label="航班号：">
          {{ sendBoardingNotifyForm.flight }}
        </el-form-item>
        <el-form-item label="通知时间：" prop="etd">
          <base-time-picker v-model="sendBoardingNotifyForm.etd" />
        </el-form-item>
      </base-form>
    </base-dialog>
    <!--选择预约时间弹窗-->
    <base-dialog
      :visible.sync="selectReserveTimeVisible"
      title="选择预约时间"
      width="400px"
      @closed="selectReserveTimeForm.time = ''"
    >
      <base-form :model="selectReserveTimeForm" :rules="selectReserveTimeFormRules" label-width="120px" @submit="submitSelectReserveTimeForm" @cancel="selectReserveTimeVisible = false">
        <el-form-item label="选择时间：" prop="time">
          <base-time-picker v-model="selectReserveTimeForm.time" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import BaseTable from '@/components/table/BaseTable'
import ApiObject from '@/api/module/beDispatch/BeDispatchDispatchApi'
import FlightApi from '@/api/module/beDispatch/BeDispatchFlightApi'
import DispatchDialog from '../../service-center/common/DispatchDialog'
import RuntimeApi from '../../../api/module/beDispatch/BeDispatchRuntimeApi'
import OverallApi from '../../../api/module/beDispatch/BeDispatchOverallApi'
import TaskApi from '../../../api/module/beDispatch/BeDispatchTaskApi'
import WebsocketApi from '../../../api/module/socket/SocketWebsocketApi'
import { WebsocketMixins } from '../../../mixins/websocket-mixins'
export default {
  name: 'OperatingStatus',
  components: { BaseTable, DispatchDialog },
  mixins: [Mixins, WebsocketMixins],
  props: {},
  data() {
    return {
      queryParams: {
        status: '0'
      },
      showFlighted: false,
      websocketUrl: `/websocket?id=${this.$utils.getRandom()}&hallId=-1`,
      selectTimeKeyArr: ['secureNotify', 'terminalDoor1', 'survilnNotify', 'carAppoint', 'lungageAppoint', 'boardingNotify'],
      selectReserveTimeForm: {
        id: '',
        key: '',
        time: ''
      },
      selectReserveTimeVisible: false,
      selectReserveTimeFormRules: {
        time: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      sendBoardingNotifyVisible: false,
      sendBoardingNotifyFormRules: {
        etd: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const now = new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0')
          if (!value) {
            callback(new Error('必填项不能为空'))
          } else if (now > `${value}`) {
            callback(new Error('请填写正确的时间'))
          } else {
            callback()
          }
        } }]
      },
      sendBoardingNotifyForm: {
        flight: '',
        etd: ''
      },
      flightPickupHeaders: [
        { label: '序号', type: 'index' },
        { label: '航班号', prop: 'flightCode' },
        { label: '预计到达', prop: 'eta' },
        { label: '航班状态', prop: 'flightStatus' },
        { label: '总人数', prop: 'headcount' },
        { label: '第一次通知', prop: 'firstNotify', slot: 'firstNotify' },
        { label: '第二次通知', prop: 'secondNotify', slot: 'secondNotify' }
      ],
      pickupList: [],
      pickupPassengerList: [],
      alertPromptList: [],
      websock: null,
      workDialogForm: {
        dispatchOrderWorkflowList: []
      },
      options: {},
      polling: true, // 开启轮询
      pickerOptions: {
        format: 'HH:mm'
      },
      dispatchStatHallList: [], // 左侧厅房统计
      dispatchStatTaskList: [], // 第一个table
      overallList: [], // 第二个table
      dynamicTable: [],
      ApiObject,
      taskUnCompletedNumber: 0,
      taskCompletedNumber: 0,
      dispatchTaskList: [],
      dispatchTaskVisible: false, // 调度任务列表弹窗
      newTaskVisible: false, // 任务调度弹窗
      pickupVisible: false, // 航班接机保障弹窗
      flightVisible: false, // 航班弹窗
      workVisible: false, // 作业状态弹窗
      hallVisible: false, // 厅房弹窗
      dialogFormRules: {
        carBookingTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        carArrivedTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        securityBookingTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        securityArrivedTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dialogForm: {// 任务调度
      },
      pickupDialogForm: {
        serveList: [],
        pickup: {}
      },
      hallDialogForm: {
        serveList: [],
        attendantList: {}
      }, // 厅房状态
      flightDialogForm: {// 航班状态
        vehicleArrive: '',
        vehicleReserve: '',
        checkNotify: '',
        checkArrive: ''
      },
      flightDialogFormRules: {
        // vehicleArrive: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        // vehicleReserve: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        // checkNotify: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        // checkArrive: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      flightList: [], // 航班状态
      currentFlight: {}, // 当前查询的航班
      dispatchStatTaskHeaders: [
        { label: '序号', type: 'index' },
        { label: '航班号', prop: 'flightCode' },
        { label: '预计起飞', prop: 'etd' },
        { label: '航班状态', prop: 'flightStatus' },
        { label: '预计到场', prop: 'eta' },
        { label: '到场通报', prop: 'ata' },
        { label: '登机口', prop: 'gate' },
        { label: '总人数', prop: 'totalHeadcount' },
        { label: '引领通知', prop: 'leadingNotify', slot: 'leadingNotify' },
        { label: '登机通知', prop: 'boardingNotify', slot: 'boardingNotify' },
        { label: '手动通知', prop: 'onceNotify', slot: 'onceNotify' },
        { label: '车辆预约', prop: 'vehicleReserve' },
        { label: '车辆到达', prop: 'vehicleArrive' },
        { label: '安检通知', prop: 'checkNotify' },
        { label: '安检到达', prop: 'checkArrive' },
        { label: '操作', slot: 'operator', width: '140px' }
      ],
      dispatchStatJobHeaderObj: {
        normalHeaders: [],
        complexHeaders: [
          {
            label: '安检',
            children: [
              { label: '预约', prop: 'secureNotify', foreignKey: 'secureArrive' },
              { label: '到达', prop: 'secureArrive' }
            ]
          },
          {
            label: '保安',
            children: [
              { label: '预约', prop: 'terminalDoor1', foreignKey: 'terminalDoor2' },
              { label: '到达', prop: 'terminalDoor2' }
            ]
          },
          {
            label: '监护',
            children: [
              { label: '预约', prop: 'survilnNotify', foreignKey: 'survilnArrive' },
              { label: '到达', prop: 'survilnArrive' }
            ]
          },
          {
            label: '行李搬运',
            children: [
              { label: '预约', prop: 'lungageAppoint', foreignKey: 'lungageArrive' },
              { label: '到达', prop: 'lungageArrive' }
            ]
          },
          {
            label: '车辆',
            children: [
              { label: '预约', prop: 'carAppoint', foreignKey: 'carArrive' },
              { label: '到达', prop: 'carArrive' }
            ]
          },
          {
            label: '登机',
            children: [
              { label: '开始登机', prop: 'boardingStarted', foreignKey: 'boardingNow' },
              { label: '正在登机', prop: 'boardingNow' }
            ]
          },
          {
            label: '登机完成',
            children: [
              { label: '预约', prop: 'boardingNotify', foreignKey: 'boardingConfirm' },
              { label: '到达', prop: 'boardingConfirm' }
            ]
          }
        ]
      },
      dispatchStatJobHeaders: [
        { label: '序号', type: 'index' },
        { label: '作业编号', prop: 'id' },
        { label: '航班号', prop: 'flightNo' },
        { label: '预计起飞', prop: 'etd' },
        { label: '预计到场', prop: 'eta' },
        { label: '到场通报', prop: 'ata' },
        { label: '登机口', prop: 'boardingGate' },
        { label: '总人数', prop: 'headcount' },
        { label: '开始', prop: 'serviceStart', slot: 'serviceStart', width: '120px' },
        { label: '厅房准备', prop: 'loungeReady', slot: 'loungeReady', width: '120px' },
        { label: '信息核对', prop: 'infoConfirm', slot: 'infoConfirm', width: '120px' },
        { label: '安检预约', prop: 'secureNotify', slot: 'secureNotify', width: '120px' },
        { label: '安检到达', prop: 'secureArrive' },
        { label: '保安预约', prop: 'terminalDoor1', slot: 'terminalDoor1', width: '120px' },
        { label: '保安到达', prop: 'terminalDoor2' },
        { label: '监护预约', prop: 'survilnNotify', slot: 'survilnNotify', width: '120px' },
        { label: '监护到达', prop: 'survilnArrive' },
        { label: '行李搬运预约', prop: 'lungageAppoint', slot: 'lungageAppoint', width: '120px' },
        { label: '行李搬运到达', prop: 'lungageArrive', width: '120px' },
        { label: '车辆预约', prop: 'carAppoint', slot: 'carAppoint', width: '120px' },
        { label: '车辆到达', prop: 'carArrive' },
        { label: '登机完成预约', prop: 'boardingNotify', slot: 'boardingNotify', width: '120px' },
        { label: '登机完成到达', prop: 'boardingConfirm' }
        /* { label: '安检', children: [
          { label: '预约', prop: 'secureNotify', slot: 'secureNotify' },
          { label: '到达', prop: 'secureArrive' }
        ] },
        { label: '监护', children: [
          { label: '预约', prop: 'survilnNotify' },
          { label: '到达', prop: 'survilnArrive' }
        ] },
        { label: '车辆', children: [
          { label: '预约', prop: 'carAppoint' },
          { label: '到达', prop: 'carArrive' }
        ] },
        /!* { label: '候机楼', children: [
          { label: '消防门', prop: 'terminalDoor1' },
          { label: '一楼铁门', prop: 'terminalDoor2' }
        ] },*!/
        { label: '登机', children: [
          { label: '预约', prop: 'boardingNotify' },
          { label: '完成', prop: 'boardingConfirm' }
        ] }*/
      ]
    }
  },
  watch: {
    showFlighted: function(newVal, oldVal) {
      this.init()
    }
  },
  methods: {
    async submitSelectReserveTimeForm() {
      const res = await OverallApi.update(this.getSubmitSelectReserveTimeData())
      this.getTableData()
      this.$message.success(res.message)
      this.selectReserveTimeVisible = false
    },
    getSubmitSelectReserveTimeData() {
      const { id, key, time } = this.selectReserveTimeForm
      const data = { id }
      data[key] = time
      return data
    },
    selectReserveTime(obj, key) {
      this.selectReserveTimeForm.id = obj.id
      this.selectReserveTimeForm.key = key
      if (obj[key]) {
        this.selectReserveTimeForm.time = obj[key]
      }
      this.selectReserveTimeVisible = true
    },
    async submitSendBoardingNotifyForm() {
      console.log(this.sendBoardingNotifyForm)

      const res = await RuntimeApi.etd(this.sendBoardingNotifyForm)
      this.$message.success(res.message)

      this.sendBoardingNotifyVisible = false
    },
    sendBoardingNotify(obj) {
      this.sendBoardingNotifyForm.etd = ''
      this.sendBoardingNotifyForm.flight = obj.flightCode
      this.sendBoardingNotifyVisible = true
    },
    async showPickupPassenger(row) {
      const res = await RuntimeApi.pickup(row.flightCode)
      // this.currentFlight = row
      this.pickupPassengerList = res.data.serveList
      this.pickupDialogForm = res.data.pickup
      this.pickupVisible = true
    },
    async confirmFinish(obj, type, typeName) {
      await this.$confirm(typeName + '确认完成?', '确认')
      const { id } = obj
      const data = { id }
      data[type] = this.$moment().format('HH:mm')
      const res = await OverallApi.update(data)
      this.getTableData()
      this.$message.success(res.message)
    },
    async delAlertPromp(item, $index) {
      await WebsocketApi.edit(item)
      this.alertPromptList.splice($index, 1)
    },
    async websocketonmessageCallBack(data) { // 数据接收
      data && this.alertPrompt(data)
    },
    alertPrompt(data) {
      data = this.$utils.isArray(data) ? data : [data]
      this.alertPromptList = [...this.alertPromptList, ...data]
    },
    async dispatch(obj) {
      const res = await OverallApi.init(obj.id)
      this.dialogForm = res.data
      this.dialogVisible = true
    },
    resetFlightDialogForm() {
      this.flightDialogForm = this.$utils.reset(this.flightDialogForm)
      this.flightList = []
    },
    async cancelTask(obj, $index) {
      await this.$confirm('确认取消?', '取消')
      const res = await TaskApi.cancel(obj.id)
      this.dispatchTaskList.splice($index, 1)
      this.$message.success(res.message)
    },
    async showDispatchTask() {
      const res = await TaskApi.todays()
      this.dispatchTaskList = res.data
      this.dispatchTaskVisible = true
    },
    async getTableData() {
      const result = await RuntimeApi.dashboard(this.queryParams)
      const data = result.data || {}
      this.dispatchStatHallList = data.loungeList
      this.dispatchStatTaskList = data.flightList
      this.overallList = data.overallList
      this.taskCompletedNumber = (Number(data.allTasks) - Number(data.unfinishedTasks))
      this.taskUnCompletedNumber = data.unfinishedTasks
      this.pickupList = data.pickupList
      // this.dynamicTable = data.dynamicTable // table自定义列
    },
    async showHall(obj) {
      const res = await RuntimeApi.hall(obj.id)
      this.hallDialogForm = { ...res.data }
      this.hallVisible = true
    },
    async submitFlightDialogForm() {
      const res = await FlightApi.update(this.flightDialogForm)
      this.init()
      this.$message.success(res.message)
      this.flightVisible = false
    },
    async showFlight(row, column, event) {
      const res = await RuntimeApi.flight(row.flightCode)
      this.currentFlight = row
      this.flightList = res.data.serveList
      this.flightDialogForm = res.data.flight
      this.flightVisible = true
    },
    async showWork(row, column, event) {
      const res = await OverallApi.getOverall(row.id)
      this.workDialogForm = res.data
      this.workVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .danger-text{
    color: red;
  }
  .alert-prompt-container{
    position: fixed;
    top: 0;
    z-index: 9;
    width: 50%;
    margin-left: 25%;
    height: fit-content;
    text-align: center;
    .alert-prompt-item{
      border: 1px solid #ececec;
      padding: 20px;
      box-sizing: border-box;
      margin: 20px;
      background-color: rgba(255,255,255,.9);
      .alert-prompt-item-title{
        font-weight: bold;
        margin: 0 20px;
      }
    }
  }
  .card-container{
    width: 200px;
    border: 1px solid #ececec;
    padding: 30px 10px;
    min-width: 200px;
  }
  .right-card{
    background-color: #5ee997;
    height: fit-content;
    padding: 10px;
    ~ .right-card{
      margin-top: 10px;
    }
    &.full{
      background-color: #ffc0cb;
    }
    span{
      font-size: 14px;
      line-height: 30px;
      display: block;
    }
  }
  .timeline-container{
    padding: 0 20px;
    border-left: 1px solid #7ae932;
    margin-top: -18px;
    .timeline-item-timestamp{
      margin-left: 10px;
    }
  }
</style>
