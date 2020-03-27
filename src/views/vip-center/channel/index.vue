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
          <el-form-item label="发行渠道ID：">
            <el-input v-model="queryParams.channelCode" placeholder="关键字" />
          </el-form-item>
          <el-form-item label="发行渠道名称：">
            <el-input v-model="queryParams.channelName" placeholder="关键字" />
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
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button type="primary" @click.stop="edit(scope.row)">
          编辑
        </el-button>
        <el-button v-if="scope.row.madeCount == 0" type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>
    <base-dialog
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      width="530px"
      center
      @closed="reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="发行渠道名称：" prop="channelName">
          <el-input v-model="dialogForm.channelName" placeholder="渠道名称" />
        </el-form-item>
        <el-form-item label="联系人：" prop="contact">
          <el-input v-model="dialogForm.contact" placeholder="联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人手机号：" prop="phonenum">
          <el-input v-model="dialogForm.phonenum" placeholder="联系人手机号" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="dialogForm.remark" placeholder="备注" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatChannelApi'
export default {
  name: 'Channel',
  mixins: [Mixins],
  data() {
    return {
      ApiObject: ApiObject,
      dialogFormRules: {
        channelName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        contact: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        phonenum: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        channelName: '',
        contact: '',
        phonenum: '',
        remark: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '发行渠道ID', prop: 'channelCode' },
        { label: '发行渠道名称', prop: 'channelName' },
        { label: '联系人', prop: 'contact' },
        { label: '联系人手机号', prop: 'phonenum' },
        { label: '备注', prop: 'remark' },
        { label: '创建时间', prop: 'createTime' },
        { label: '已制卡数量', prop: 'madeCount' },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        channelCode: '',
        channelName: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
