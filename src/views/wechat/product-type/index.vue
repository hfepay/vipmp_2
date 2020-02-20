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
          <el-form-item label="服务编码：">
            <el-input v-model="queryParams.datadictCode" placeholder="服务编码" />
          </el-form-item>
          <el-form-item label="类型名称：">
            <el-input v-model="queryParams.name" placeholder="类型名称" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.status" clearable filterable placeholder="状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.productTypeSatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-button type="primary" @click="search">
            查询
          </el-button>
          <el-button type="primary" @click="exportExcel">
            导出
          </el-button>
        </base-form>
      </template>
      <template slot="top-right">
        <el-button type="primary" @click="add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="edit(scope.row)">
          修改
        </el-button>
        <el-button v-if="scope.row.status =='已上架' " @click.stop="lower(scope.row)">
          下架
        </el-button>
        <el-button v-else @click.stop="upper(scope.row)">
          上架
        </el-button>
        <el-button type="danger" @click.stop="del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>

    <base-dialog
      :title="dialogForm['id']?'修改':'新增'"
      :visible.sync="dialogVisible"
      width="600px"
      center
      @closed="reset"
    >
      <base-form
        ref="form"
        :model="dialogForm"
        :rules="dialogFormRules"
        label-width="150px"
        @submit="submit"
        @cancel="dialogVisible = false"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联服务类型：" prop="datadictId">
              <el-select v-model="dialogForm.datadictId" filterable placeholder="请选择" style="width: 325px">
                <el-option
                  v-for="(item, $index) in datadictOptions"
                  :key="$index"
                  :label="item.label"
                  :value="`${item.value}`"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型名称：" prop="name">
              <el-input v-model="dialogForm.name" placeholder="产品类型" style="width: 330px" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="标签：" prop="labelList">
              <el-table
                :data="dialogForm.labelList"
                border
                style="width: 100%"
                :show-header="false"
              >
                <el-table-column prop="label">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.label" />
                  </template>
                </el-table-column>

                <el-table-column width="100px">
                  <template slot-scope="scope">
                    <el-button v-if="scope.$index == 0 &&(dialogForm.labelList || []) .length < 10" type="primary" @click="addAccompany">
                      新增
                    </el-button>
                    <el-button v-else type="danger" @click="delAccompany(scope.$index, scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--<el-button v-if="dialogForm.accompanyList.length < maxNum" type="primary" style="width: 100%;margin-top: 10px" @click="addAccompany">-->
              <!--新增-->
              <!--</el-button>-->
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="可预订日期范围：" prop="dateRange">
              后  <el-input v-model="dialogForm.dateRange" type="number" placeholder="整数" style="width: 310px" /> 天
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="可预订时间范围：" prop="timeRange">
              <el-time-picker
                v-model="dialogForm.timeRange"
                is-range
                format="HH:mm"
                value-format="HH:mm"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单次服务时长:" prop="singleTime">
              <el-input v-model="dialogForm.singleTime" type="number" placeholder="小于单日总时长的整数" style="width: 320px" /> 小时
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间选择间隔:" prop="timeInterval">
              <el-radio-group v-model="dialogForm.timeInterval">
                <el-radio label="15">
                  15分钟
                </el-radio>
                <el-radio label="30">
                  30分钟
                </el-radio>
                <el-radio label="60">
                  60分钟
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="库存规则:" prop="stockRule">
              <el-radio-group v-model="dialogForm.stockRule">
                <el-radio label="0">
                  单个产品预订时间不能交叉
                </el-radio>
                <el-radio label="1">
                  无限制
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序：" prop="orderNum">
              <el-input v-model="dialogForm.orderNum" type="number" placeholder="整数" style="width: 330px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="预约须知：" prop="notice">
              <el-input v-model="dialogForm.notice" autosize type="textarea" placeholder="预约须知" style="width: 330px" />
            </el-form-item>
          </el-col>
          <el-col v-if="!dialogForm.id" :span="24">
            <el-form-item label="是否立即上架：" prop="deploy">
              <el-switch v-model="dialogForm.deploy" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图库：" prop="imgName">
              <base-upload
                v-model="dialogForm.imgName"
                :limit="3"
                :file-size="2"
                list-type="picture-card"
                :file-list="fileList"
              >
                <i class="el-icon-plus" />
              </base-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </base-form>
    </base-dialog>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import DatadictApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import ApiObject from '../../../api/module/wechat/WechatProductTypeApi'
import { validateInteger } from '../../../utils/validate/validate-element'
import BaseUpload from '../../../components/upload/BaseUpload'

export default {
  name: 'ProductType',
  components: { BaseUpload },
  mixins: [Mixins],
  data: function() {
    return {
      ApiObject: ApiObject,
      datadictOptions: [], // 产品类型下拉框
      queryParams: {
        status: '',
        datadictCode: '',
        name: ''
      },
      fileList: [],
      dialogForm: {
        datadictId: '',
        deploy: false,
        imgName: [],
        labelList: [{}],
        notice: '',
        name: '',
        dateRange: '',
        singleTime: '',
        timeInterval: '',
        stockRule: '',
        orderNum: '',
        timeRange: ''
      },
      dialogFormRules: {
        datadictId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        name: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        // deploy: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        labelList: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        dateRange: [{ required: true, trigger: 'change', validator: validateInteger }],
        /* timeRange: [{ required: true, message: '必填项不能为空', trigger: 'change' }],*/
        singleTime: [
          { type: 'number', min: 0, max: 24, message: '范围0-24', trigger: 'change', validator: (rule, value, callback) => {
            if (value) {
              const checkResult = Number(value) >= 0 && Number(value) <= 24
              if (checkResult) {
                callback()
              } else {
                callback(new Error('范围0-24'))
              }
            } else {
              callback()
            }
          } }
        ],
        /* timeInterval: [{ required: true, message: '必填项不能为空', trigger: 'change' }],*/
        stockRule: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        orderNum: [{ required: true, trigger: 'change', validator: validateInteger }],
        notice: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        imgName: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '服务编码', prop: 'datadictCode' },
        { label: '类型名称', prop: 'name' },
        { label: '标签', prop: 'label' },
        { label: '可预订日期范围', prop: 'dateRange', prefix: '后', suffix: '天' },
        { label: '可预订时间范围', prop: 'timeRange' },
        { label: '单次服务时长', prop: 'singleTime', suffix: '小时' },
        { label: '时间选择间隔', prop: 'timeInterval', suffix: '分钟' },
        { label: '创建时间', prop: 'createTime' },
        { label: '排序', prop: 'orderNum' },
        { label: '状态', prop: 'status' },
        { label: '操作', slot: 'operator', width: 230 }
      ]
    }
  },
  methods: {
    addBefore() {
      this.$set(this.dialogForm, 'deploy', false)
    },
    async lower(obj) {
      await this.$confirm('确认下架?', '下架')
      const result = await this.ApiObject.lower(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    async upper(obj) {
      await this.$confirm('确认上架?', '上架')
      const result = await this.ApiObject.upper(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    resetAfter() {
      this.fileList = []
      this.dialogForm.labelList = [{}]
      this.dialogForm.timeRange = ''
    },
    addAccompany() {
      this.dialogForm.labelList.push({
        label: ''
      })
    },
    delAccompany(index) {
      this.dialogForm.labelList.splice(index, 1)
    },
    getFinalDialogFormParams() {
      const data = { ...this.dialogForm }
      if (this.dialogForm.timeRange && this.dialogForm.timeRange.length > 0) {
        data.startTime = this.dialogForm.timeRange[0]
        data.endTime = this.dialogForm.timeRange[1]
      } else {
        data.startTime = ''
        data.endTime = ''
      }
      delete data.timeRange
      if (this.$utils.isString(data.imgName)) {
        data.imgName = data.imgName.split(',').map(item => {
          return {
            imgName: item,
            realName: item
          }
        })
      }
      data.labelList = this.dialogForm.labelList.map(item => item.label)
      return data
    },
    createdAspectBefore() {
      this.initDatadictOptions()
    },
    async initDatadictOptions() {
      this.datadictOptions = await DatadictApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.SERVER_TYPE)
    },
    async editAfter(res) {
      const startTime = this.dialogForm.startTime ? `${this.dialogForm.startTime}` : null
      const endTime = this.dialogForm.endTime ? `${this.dialogForm.endTime}` : null
      this.$set(this.dialogForm, 'timeRange', [])
      this.dialogForm.singleTime && this.$set(this.dialogForm, 'singleTime', Number(this.dialogForm.singleTime))
      if (startTime && endTime) {
        this.$set(this.dialogForm.timeRange, 0, startTime)
        this.$set(this.dialogForm.timeRange, 1, endTime)
      }
      this.fileList = this.dialogForm.imgName.map(item => {
        return {
          name: item.imgName,
          url: this.$utils.imgWrapper(item.imgName)
        }
      })

      this.dialogForm.labelList = this.dialogForm.labelList.map(item => {
        return {
          label: item
        }
      })
    }

  }

}

</script>

<style scoped>

</style>
