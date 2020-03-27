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
          <el-form-item label="卡种ID：">
            <el-input v-model="queryParams.typeCode" placeholder="按卡种ID查询" />
          </el-form-item>
          <el-form-item label="卡种名称：">
            <el-input v-model="queryParams.typeName" placeholder="按卡种名称查询" />
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

      <template slot="rule" slot-scope="{scope}">
        {{ scope.row.rule | invalidRuleFilter }}
      </template>
      <template slot="supportService" slot-scope="{scope}">
        {{ formatSupportService(scope.row.supportService) }}
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="show(scope.row)">
          查看
        </el-button>
        <el-button v-if="scope.row.madeCount == 0" type="primary" @click.stop="edit(scope.row)">
          编辑
        </el-button>
        <el-button v-if="scope.row.madeCount == 0" type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>

    <base-dialog
      :title="dialogForm['id']?dialogForm._operate === 'show'?'查看':'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="600px"
      center
      @closed="reset"
    >
      <base-form
        ref="form"
        :disabled="dialogForm._operate === 'show'"
        :model="DialogForm"
        :rules="dialogFormRules"
        label-width="170px"
        @submit="Mixins_$Submit"
        @cancel="Mixins_$DialogVisible = false"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="卡种名称：" prop="typeName">
              <el-input v-model="dialogForm.typeName" placeholder="卡种名称" style="width: 330px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卡面值：" prop="value">
              <el-input v-model="dialogForm.value" type="number" placeholder="卡面值" style="width: 330px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="有效期:" prop="validation">
              <el-radio-group v-model="dialogForm.validation">
                <el-radio v-for="(item, $index) in validationOptions" :key="$index" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="失效规则:" prop="rule">
              <el-radio-group v-model="dialogForm.rule">
                <el-radio v-for="(item, $index) in ruleOptions" :key="$index" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="支持折扣的服务和厅房:" prop="supportServiceList">
              <el-tree
                :key="dialogVisible"
                ref="tree"
                :props="defaultProps"
                :data="treeOption"
                :default-checked-keys="checkedKeys"
                show-checkbox
                node-key="id"
                @check="initSupportServiceList"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="折扣率：" prop="discountRate">
              <el-input v-model="dialogForm.discountRate" placeholder="请输入折扣率(0~9.99)" style="width: 330px" /> 折
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权益介绍：" prop="remark">
              <el-input v-model="dialogForm.remark" type="textarea" placeholder="服务项目" style="width: 330px" />
            </el-form-item>
          </el-col>
        </el-row>
      </base-form>
    </base-dialog>
  </div>
</template>

<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '../../../api/module/wechat/WechatCardTypeApi'
import toTreeData from '../../../utils/tree'

export default {
  name: 'Card',
  mixins: [Mixins],
  data() {
    return {
      validationOptions: [
        { label: '1年', value: 1 },
        { label: '2年', value: 2 },
        { label: '3年', value: 3 },
        { label: '5年', value: 5 }
      ],
      ruleOptions: [
        { label: '到期卡失效', value: 0 },
        { label: '到期权益失效', value: 1 }
      ],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeOption: [],
      ApiObject: ApiObject,
      queryParams: {
        id: '',
        typeName: ''
      },
      fileList: [],
      dialogForm: {
        typeName: '',
        value: '',
        validation: 1,
        rule: 0,
        stockRule: '0',
        supportServiceList: [],
        discountRate: '',
        remark: ''
      },
      dialogFormRules: {
        typeName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        value: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        validation: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        rule: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        discountRate: [{ required: true, trigger: 'change', validator: (rules, val, callback) => {
          const regex = /^[0-9]([.]\d{1,2})?$/g
          if (!val) {
            callback(new Error('必填项不能为空'))
          } else if (!regex.test(val)) {
            callback(new Error('折扣输入不合法'))
          } else {
            callback()
          }
        } }],
        remark: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        supportServiceList: [{ type: 'array', required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '卡种ID', prop: 'typeCode' },
        { label: '卡种名称', prop: 'typeName' },
        { label: '面值', prop: 'value' },
        { label: '支持折扣的服务和厅房', prop: 'supportService', slot: 'supportService' },
        { label: '折扣率', prop: 'discountRate', suffix: ' 折' },
        { label: '有效期', prop: 'validation', suffix: ' 年' },
        { label: '失效规则', prop: 'rule', slot: 'rule' },
        { label: '创建日期', prop: 'createTime' },
        { label: '已制卡数量', prop: 'madeCount' },
        { label: '操作', slot: 'operator', width: 160 }
      ]
    }
  },
  computed: {
    formatSupportService() {
      return function(str) {
        var arr = JSON.parse(str)
        arr.map(item => {
          if (this.$utils.isNull(item.children)) {
            return item
          } else {
            return item.children
          }
        })
        return arr.map(item => item.name).join(',')
      }
    }
  },
  methods: {
    resetAfter() {
      this.checkedKeys = []
      this.dialogForm.validation = 1
    },
    editAfter(res) {
      this.checkedKeys = JSON.parse(res.data.supportService).map(item => item.id)
      this.$nextTick(_ => {
        this.initSupportServiceList()
      })
    },
    getTreeData() {
      const getCheckedNodes = this.$refs.tree.getCheckedNodes()
      const getHalfCheckedNodes = this.$refs.tree.getHalfCheckedNodes().map(({ id, name }) => {
        return { id, name }
      })
      const treeData = toTreeData([...getCheckedNodes, ...getHalfCheckedNodes])
      return treeData
    },
    initSupportServiceList(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.dialogForm.supportServiceList = this.getTreeData()
      this.$refs.form.validateField('supportServiceList')
    },
    createdAspectBefore() {
      this.initTreeOption()
    },
    async initTreeOption() {
      this.treeOption = await ApiObject.getSupportList()
    }
  }

}

</script>

<style scoped>

</style>
