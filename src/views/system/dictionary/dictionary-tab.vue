<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :pagination="Mixins_Pagination"
      :data="Mixins_$TableData"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item>
            <el-radio-group v-model="QueryParams.dictType" @change="handleTypeChange">
              <el-radio v-for="(item, $index) in $utils.toOptions($Contants.dictionaryType)" :key="$index" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </base-form>
      </template>
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button @click.stop="Mixins_$Edit(scope.row)">
          编辑
        </el-button>
        <el-button @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>
    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="Mixins_$Reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="DialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item :label="`${getTitle}：`" prop="dictName">
          <el-input v-model="DialogForm.dictName" :placeholder="`请输入${getTitle}`" />
        </el-form-item>
        <el-form-item label="编码：" prop="dictCode">
          <el-input v-model="DialogForm.dictCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="排序顺序：" prop="orderNum">
          <el-input v-model="DialogForm.orderNum" placeholder="请输入排序顺序" type="number" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '../../../api/module/beTrade/BeTradeDatadictApi'
export default {
  name: 'DictionaryTab',
  mixins: [Mixins],
  props: {},
  data() {
    return {
      ApiObject,
      Mixins_QueryItemByRequest: false,
      DialogFormRules: {
        dictName: [{ required: true, message: '必填项不能为空' }],
        orderNum: [{ required: true, message: '必填项不能为空' }],
        dictCode: [{ required: true, message: '必填项不能为空' }]
      },
      DialogForm: {
        dictName: '',
        orderNum: '',
        dictCode: ''
      },
      QueryParams: {
        dictType: '1'
      },
      Headers: [
        { type: 'index', label: '序号' },
        { label: '厅房区域', prop: 'dictName' },
        { label: '编号', prop: 'dictCode' },
        { label: '排列顺序', prop: 'orderNum' },
        { label: '操作', slot: 'operator', fixed: 'right', width: 180 }
      ]
    }
  },
  computed: {
    getTitle() {
      return this.$Contants.dictionaryType[this.QueryParams.dictType]
    }
  },
  methods: {
    Mixins_$GetDialogParams(data) {
      return {
        ...data,
        dictType: this.QueryParams.dictType
      }
    },
    handleTypeChange() {
      this.Headers[1].label = this.getTitle
      this.Mixins_$Init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
