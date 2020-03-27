<template>
  <!--发起调度弹窗-->
  <base-dialog
    title="调度"
    :visible.sync="Mixins_$DialogVisible"
    width="800px"
    center
    @closed="reset"
  >
    <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="130px" @submit="Mixins_$Submit" @cancel="$emit('closed')">
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="dialogForm.jobFlag" label="全流程保障：" prop="jobFlag">
            <el-switch
              v-model="dialogForm.jobFlag"
              disabled
            />
          </el-form-item>
          <el-form-item v-else label="任务类型：" prop="taskType">
            <el-select v-model="dialogForm.taskType" style="width: 100%" clearable placeholder="任务类型">
              <el-option
                v-for="(item, $index) in dispatchTaskTypeCfgList"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="旅客姓名：" prop="passengerName">
            <el-input v-model="dialogForm.passengerName" placeholder="旅客姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="旅客人数：" prop="headcount">
            <el-input v-model="dialogForm.headcount" placeholder="旅客人数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码：" prop="phoneNo">
            <el-input v-model="dialogForm.phoneNo" placeholder="手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="航班号：" prop="flight">
            <el-input v-model="dialogForm.flightNo" placeholder="航班号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起飞/到达：" prop="fromTo">
            <el-input v-model="dialogForm.fromTo" placeholder="起飞/到达" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起飞时间：" prop="etd">
            <el-input v-model="dialogForm.etd" placeholder="起飞时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到达时间：" prop="eta">
            <el-input v-model="dialogForm.eta" placeholder="到达时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="停机位：" prop="parkingLot">
            <el-input v-model="dialogForm.parkingLot" placeholder="停机位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登机口：" prop="boardingGate">
            <el-input v-model="dialogForm.boardingGate" placeholder="登记口" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务厅房：" prop="loungeName">
            <el-select v-model="dialogForm.loungeName" style="width: 100%" clearable placeholder="服务厅房">
              <el-option
                v-for="(item, $index) in hallList"
                :key="$index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配手持：" prop="assignHandsetId">
            <el-select v-model="dialogForm.assignHandsetId" style="width: 100%" clearable placeholder="分配手持">
              <el-option
                v-for="(item, $index) in dispatchDeviceList"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="notes">
            <el-input v-model="dialogForm.notes" type="textarea" placeholder="备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </base-form>
  </base-dialog>
</template>
<script>
// import { validatePhone } from '../../../utils/validate/validate-element'
// import DispatchApi from '../../../api/module/beDispatch/BeDispatchDispatchApi'
import TaskApi from '../../../api/module/beDispatch/BeDispatchTaskApi'
import OverallApi from '../../../api/module/beDispatch/BeDispatchOverallApi'
import DispatchDeviceApi from '../../../api/module/beDispatch/BeDispatchDispatchDeviceApi'
import DatadictApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'
export default {
  name: 'DispatchDialog',
  components: {},
  props: {
    value: {
      type: Object,
      default: function() {
        return {}
      }
    },
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    taskType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogForm: this.value,
      dialogFormRules: {
        // phoneNo: [{ required: true, trigger: 'blur', validator: validatePhone }],
        taskType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        flightNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        assignHandsetId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        passengerName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dispatchDeviceList: [],
      hallList: [],
      dispatchTaskTypeCfgList: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.dialogForm = { ...newVal }
      }
    },
    'dialogForm.taskType': async function(newVal, oldVal) {
      this.initName(newVal, this.dispatchTaskTypeCfgList, 'taskTypeName')
    },
    'dialogForm.assignHandsetId': async function(newVal, oldVal) {
      this.initName(newVal, this.dispatchDeviceList, 'assignHandsetName')
    }
  },
  created() {
    this.initDispatchDeviceList()
    this.initHallList()
    this.initDispatchTaskTypeCfgList()
  },
  methods: {
    async initDispatchDeviceList() {
      this.dispatchDeviceList = await DispatchDeviceApi.getOptions()
    },
    async initHallList() {
      this.hallList = await HallApi.getOptions()
    },
    async initDispatchTaskTypeCfgList() {
      this.dispatchTaskTypeCfgList = await DatadictApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.DISPATER_TYPE)
    },
    reset() {
      this.dialogForm = this.$utils.reset(this.dialogForm)
      const form = this.$refs['form']
      form && form.resetFields()
      this.$emit('closed')
    },
    async submit() {
      this.dialogForm.flightDate = new Date()
      const res = this.dialogForm.jobFlag ? await OverallApi.add(this.dialogForm) : await TaskApi.add(this.dialogForm)
      this.$message.success(res.message)
      this.$emit('closed')
    },
    initName(val, list, key) {
      const result = list.filter(item => item.value === val)[0]
      result && (this.dialogForm[key] = result.label)
    }
  }
}
</script>

<style scoped>
</style>
