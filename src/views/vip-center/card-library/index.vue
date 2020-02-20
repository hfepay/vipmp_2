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
          <el-form-item label="卡种ID：">
            <el-input v-model="queryParams.typeCode" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="卡种名称：">
            <el-input v-model="queryParams.typeName" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="持卡方类型：">
            <el-select v-model="queryParams.ownerType" clearable placeholder="持卡方类型">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.cardOwnerType)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="持卡方身份证：">
            <el-input v-model="queryParams.idNumber" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="激活时间：">
            <base-date-picker
              v-model="queryParams.activeDateRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="发行渠道ID：">
            <el-input v-model="queryParams.channelCode" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="发行渠道名称：">
            <el-input v-model="queryParams.channelName" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="持卡方名称：">
            <el-input v-model="queryParams.ownerName" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="queryParams.phoneNum" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="到期时间：">
            <base-date-picker
              v-model="queryParams.endDateRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="卡号：">
            <el-input v-model="queryParams.cardNum" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="queryParams.status" clearable placeholder="状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.valiableStatus)"
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
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="show(scope.row)">
          查看
        </el-button>
        <template v-if="scope.row.status == '1'">
          <el-button type="primary" @click.stop="edit(scope.row)">
            修改
          </el-button>
          <el-button type="danger" @click.stop="freeze(scope.row)">
            冻结
          </el-button>
        </template>
        <template v-if="scope.row.status == '3'">
          <el-button type="primary" @click.stop="unfreeze(scope.row)">
            解冻
          </el-button>
        </template>
      </template>
    </base-table-layout>
    <base-dialog
      :title="dialogForm['id']?'修改':'新增'"
      :visible.sync="dialogVisible"
      width="530px"
      center
      @closed="reset"
    >
      <base-form :model="dialogForm" :rules="dialogFormRules" label-width="120px" @submit="submit" @cancel="dialogVisible = false">
        <el-form-item label="客户类型：" prop="ownerType">
          <el-select v-model="dialogForm.ownerType" clearable placeholder="状态">
            <el-option
              v-for="(item, $index) in $Contants.toOptions($Contants.cardOwnerType)"
              :key="$index"
              :label="item.label"
              :value="Number(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="持卡方名称：" prop="ownerName">
          <el-input v-model="dialogForm.ownerName" placeholder="类型" />
        </el-form-item>
        <el-form-item label="办理人身份证号：" prop="idNumber">
          <el-input v-model="dialogForm.idNumber" placeholder="类型" />
        </el-form-item>
        <el-form-item label="联系电话：" prop="phoneNum">
          <el-input v-model="dialogForm.phoneNum" placeholder="类型" />
        </el-form-item>
      </base-form>
    </base-dialog>
    <base-dialog
      title="详情"
      :visible.sync="cardDialogVisible"
      width="530px"
      center客户类型
      @closed="reset"
    >
      <base-form :model="cardDialogForm" :show-default-foot="false" label-width="120px">
        <el-form-item label="卡号：" prop="cardNum">
          {{ cardDialogForm.cardNum }}
        </el-form-item>
        <el-form-item label="卡种ID：" prop="typeCode">
          {{ cardDialogForm.typeCode }}
        </el-form-item>
        <el-form-item label="卡种名称：" prop="typeName">
          {{ cardDialogForm.typeName }}
        </el-form-item>
        <el-form-item label="面值：" prop="value">
          {{ cardDialogForm.value }}
        </el-form-item>
        <el-form-item label="支持折扣产品：" prop="supportStr">
          {{ cardDialogForm.supportStr }}
        </el-form-item>
        <el-form-item label="权益折扣：" prop="discountRate">
          {{ cardDialogForm.discountRate }}
        </el-form-item>
        <el-form-item label="发行渠道ID：" prop="channelCode">
          {{ cardDialogForm.channelCode }}
        </el-form-item>
        <el-form-item label="发行渠道名称：" prop="channelName">
          {{ cardDialogForm.channelName }}
        </el-form-item>
        <el-form-item label="持卡方类型：" prop="ownerType">
          {{ cardDialogForm.ownerType | ownerTypeFilter }}
        </el-form-item>
        <el-form-item label="持卡方名称：" prop="ownerName">
          {{ cardDialogForm.ownerName }}
        </el-form-item>
        <el-form-item label="办理人身份证号：" prop="idNumber">
          {{ cardDialogForm.idNumber }}
        </el-form-item>
        <el-form-item label="联系电话：" prop="phoneNum">
          {{ cardDialogForm.phoneNum }}
        </el-form-item>
        <el-form-item label="卡余额：" prop="balance">
          {{ cardDialogForm.balance }}
        </el-form-item>
        <el-form-item label="激活时间：" prop="activeDate">
          {{ cardDialogForm.activeDate }}
        </el-form-item>
        <el-form-item label="到期时间：" prop="endDate">
          {{ cardDialogForm.endDate }}
        </el-form-item>
        <el-form-item label="有效期：" prop="validation">
          {{ cardDialogForm.validation }}年
        </el-form-item>
        <el-form-item label="到期规则：" prop="rule">
          {{ cardDialogForm.rule | validationFilter }}
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          {{ cardDialogForm.status | cardStatusFilter }}
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatCardApi'
export default {
  name: 'CardLibrary',
  mixins: [Mixins],
  data() {
    return {
      cardDialogForm: {},
      queryItemByRequest: false,
      cardDialogVisible: false,
      ApiObject: ApiObject,
      dialogFormRules: {
        a: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '卡号', prop: 'cardNum' },
        { label: '卡种ID', prop: 'typeCode' },
        { label: '卡种名称', prop: 'typeName' },
        { label: '面值', prop: 'value' },
        { label: '发行渠道ID', prop: 'channelCode' },
        { label: '发行渠道名称', prop: 'channelName' },
        {
          label: '持卡方类型',
          prop: 'ownerType',
          format: {
            0: '个人',
            1: '企业单位'
          }
        },
        { label: '持卡方名称', prop: 'ownerName' },
        { label: '办理人身份证号', prop: 'idNumber' },
        { label: '联系电话', prop: 'phoneNum' },
        { label: '卡余额', prop: 'balance' },
        { label: '激活时间', prop: 'activeDate' },
        { label: '到期时间', prop: 'endDate' },
        {
          label: '状态',
          prop: 'status',
          format: {
            0: '未激活',
            1: '已激活',
            2: '已失效',
            3: '已冻结'
          }
        },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        typeId: '',
        typeName: '',
        ownerType: '',
        idNumber: '',
        channelId: '',
        channelName: '',
        ownerName: '',
        phoneNum: '',
        cardNum: '',
        status: '',
        channelCode: '',
        activeDateRange: [],
        endDateRange: []
      }
    }
  },
  methods: {
    async show(item) {
      // todo 查询详情
      this.cardDialogForm = { ...item }
      this.cardDialogVisible = true
    },
    getFinalQueryParams(queryParams) {
      if (queryParams.activeDateRange && queryParams.activeDateRange.length > 1) {
        queryParams.activeDateMin = queryParams['activeDateRange'][0]
        queryParams.activeDateMax = queryParams['activeDateRange'][1]
      }
      if (queryParams.endDateRange && queryParams.endDateRange.length > 1) {
        queryParams.endDateMin = queryParams['endDateRange'][0]
        queryParams.endDateMax = queryParams['endDateRange'][1]
      }
      delete queryParams['activeDateRange']
      delete queryParams['endDateRange']
      return queryParams
    },
    // 冻结
    async freeze(data) {
      await this.$confirm('确认冻结?', '冻结')
      data.status = '3'
      await ApiObject.update(data)
    },
    // 解冻
    async unfreeze(data) {
      await this.$confirm('确认解冻?', '解冻')
      data.status = '1'
      await ApiObject.update(data)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
