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
        <base-form
          :inline="true"
          :model="QueryParams"
          :show-default-foot="false"
        >
          <!--  <el-form-item label="房间编号：">
            <el-input v-model="queryParams.roomNumber" placeholder="服务编码" />
          </el-form-item>-->
          <el-form-item label="产品名称：">
            <el-input
              v-model="queryParams.productName"
              placeholder="类型名称"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryParams.productStatus"
              clearable
              filterable
              placeholder="状态"
            >
              <el-option
                v-for="(item, $index) in $Contants.toOptions(
                  $Contants.productTypeSatus
                )"
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
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <template slot="productStatus" slot-scope="{ scope }">
        {{ scope.row.productStatus | deployStatusFilter }}
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{ scope }">
        <el-button @click.stop="Mixins_$Edit(scope.row)">
          修改
        </el-button>
        <el-button @click.stop="deploy(scope.row)">
          {{ getDeployText(scope.row.productStatus) }}
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>

    <base-dialog
      :title="dialogForm['id'] ? '修改' : '新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="700px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form
        ref="form"
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="150px"
        @submit="Mixins_$Submit"
        @cancel="Mixins_$DialogVisible = false"
      >
        <el-form-item label="所属产品类型：" prop="datadictId">
          <el-select
            v-model="DialogForm.datadictId"
            filterable
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, $index) in productTypeOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联房间：" prop="hallId">
          <el-select
            v-model="DialogForm.hallId"
            filterable
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, $index) in finalHallOptions"
              :key="$index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称：" prop="productName">
          <el-input v-model="DialogForm.productName" placeholder="产品名称" />
        </el-form-item>
        <el-form-item label="属性简介：" prop="propertyBrief">
          <el-input v-model="DialogForm.propertyBrief" placeholder="属性简介" />
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="DialogForm.price" type="number" placeholder="产品价格" />
        </el-form-item>
        <el-form-item v-if="!dialogForm.id" label="是否立即上架：" prop="deliverIf">
          <el-switch
            v-model="DialogForm.deliverIf"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="位置：" prop="place">
          <el-input
            v-model="DialogForm.place"
            placeholder="请输入产品所在位置"
          />
        </el-form-item>
        <el-form-item label="基本属性：" prop="baseProperty">
          <el-row
            v-for="(item, $index) in dialogForm.baseProperty"
            :key="$index"
            :gutter="10"
          >
            <el-col :span="10">
              <el-input v-model="DialogForm.baseProperty[$index].propertyName" :maxlength="4" placeholder="名称" />
            </el-col>
            <el-col :span="10">
              <el-input
                v-model="DialogForm.baseProperty[$index].propertyContent"
                :maxlength="4"
                placeholder="内容"
              />
            </el-col>
            <el-col :span="3">
              <el-button
                v-if="$index === 0 && dialogForm.baseProperty.length < 10"
                type="primary"
                @click="Mixins_$AddAccompany"
              >
                新增
              </el-button>
              <el-button
                v-else
                type="danger"
                @click="delAccompany($index, item)"
              >
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="DialogForm.sort" placeholder="整数" />
        </el-form-item>
        <el-form-item label="服务项目：" prop="serviceItem">
          <el-input
            v-model="DialogForm.serviceItem"
            type="textarea"
            placeholder="服务项目"
          />
        </el-form-item>
        <el-form-item label="使用规则：" prop="rule">
          <el-input
            v-model="DialogForm.rule"
            type="textarea"
            placeholder="使用规则"
          />
        </el-form-item>
        <el-form-item label="图库：" prop="imgName">
          <base-upload
            v-model="DialogForm.imgName"
            list-type="picture-card"
            :limit="3"
            :file-size="2"
            :file-list="fileList"
          >
            <i class="el-icon-plus" />
          </base-upload>
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import DatadictApi from '../../../api/module/beTrade/BeTradeDatadictApi'
import ApiObject from '../../../api/module/wechat/WechatProductApi'
import ProductTypeApiApi from '../../../api/module/wechat/WechatProductTypeApi'
import BaseUpload from '../../../components/upload/BaseUpload'
import HallApi from '../../../api/module/beTrade/BeTradeHallApi'

export default {
  name: 'Product',
  components: { BaseUpload },
  mixins: [Mixins],
  data() {
    return {
      ApiObject,
      serviceTypeOptions: [], // 服务类型下拉框
      productTypeOptions: [], // 产品类型下拉框
      HallOptions: [],
      queryParams: {
        productName: '',
        productStatus: ''
      },
      fileList: [],
      dialogFormRules: {
        datadictId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        hallId: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        productName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        propertyBrief: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        price: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        deliverIf: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        place: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        baseProperty: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        serviceItem: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        rule: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        imgName: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        datadictId: '',
        hallId: '',
        productName: '',
        deliverIf: 0,
        propertyBrief: '',
        price: '',
        sort: '',
        place: '',
        serviceItem: '',
        rule: '',
        imgName: [],
        baseProperty: [{}]
      },
      Headers: [
        { label: '序号', type: 'index' },
        { label: '房间名称', prop: 'roomName' },
        { label: '产品名称', prop: 'productName' },
        { label: '所属服务编码', prop: 'serviceCode' },
        { label: '所属类型名称', prop: 'typeName' },
        { label: '属性简介', prop: 'propertyBrief' },
        { label: '价格', prop: 'price' },
        { label: '创建时间', prop: 'foundTime' },
        { label: '排序', prop: 'sort' },
        { label: '状态', prop: 'productStatus', slot: 'productStatus' },
        { label: '操作', slot: 'operator', width: 160 }
      ]
    }
  },
  computed: {
    finalHallOptions() {
      return [...this.HallOptions, ...[{ label: '不限', value: '0' }]]
    },
    getDeployText() {
      return function(status) {
        return status == 0 ? '上架' : '下架'
      }
    }
  },
  created() {
    this.initServiceTypeOptions()
    this.initHallOptions()
    this.initProductTypeOptions()
  },
  methods: {
    async initProductTypeOptions() {
      this.productTypeOptions = await ProductTypeApiApi.getOptions()
    },
    async deploy(obj) {
      const text = this.getDeployText(obj.productStatus)
      await this.$confirm(`确认${text}?`, text)
      const result = obj.productStatus == 0 ? await this.ApiObject.up(obj.id) : await this.ApiObject.down(obj.id)
      this.init()
      this.$message.success(result.message)
    },
    Mixins_ResetAfter() {
      this.fileList = []
      this.dialogForm.baseProperty = [{}]
      this.dialogForm.stockRule = '0'
    },
    addAccompany() {
      this.dialogForm.baseProperty.push({
        propertyName: '',
        propertyContent: ''
      })
    },
    delAccompany(index) {
      this.dialogForm.baseProperty.splice(index, 1)
    },
    getDialogFormParams() {
      const data = { ...this.dialogForm }
      if (this.$utils.isString(data.imgName)) {
        data.imgName = data.imgName.split(',').map(item => {
          return {
            imgName: item,
            realName: item
          }
        })
      }
      return data
    },
    async initServiceTypeOptions() {
      this.serviceTypeOptions = await DatadictApi.getOptionsByType(this.$Contants.DICTIONARY_ENUM.SERVER_TYPE)
    },
    async initHallOptions() {
      this.HallOptions = await HallApi.getOptions()
    },
    editAfter(res) {
      !this.dialogForm.baseProperty && (this.dialogForm.baseProperty = [])
      if (!this.dialogForm.baseProperty.length) {
        res.data.baseProperty.push({})
      }
      this.fileList = this.dialogForm.imgName.map(item => {
        return {
          name: item.imgName,
          url: this.$utils.imgWrapper(item.imgName)
        }
      })
    }
  }
}
</script>

<style scoped></style>
