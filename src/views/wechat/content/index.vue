<template>
  <div class="hf-container">
    <!--table模板-->
    <base-table-layout
      :page-obj="Mixins_$PageObj"
      :headers="Headers"
      :data="Mixins_$TableData"
      :pagination="Mixins_Pagination"
      @sizeChange="Mixins_$SizeChange"
      @currentChange="Mixins_$CurrentChange"
    >
      <template slot="layout-search">
        <base-form :inline="true" :model="QueryParams" :show-default-foot="false">
          <el-form-item label="发布时间：">
            <base-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="位置：">
            <el-select v-model="queryParams.place" clearable placeholder="位置">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.placeConstans)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="queryParams.articleStatus" clearable placeholder="状态">
              <el-option
                v-for="(item, $index) in $Contants.toOptions($Contants.deployStatus)"
                :key="$index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </base-form>
      </template>
      <template slot="layout-operate">
        <el-button type="primary" @click="Mixins_$Add">
          新增
        </el-button>
      </template>
      <template slot="place" slot-scope="{scope}">
        {{ scope.row.place | placeContantsFilter }}
      </template>
      <template slot="articleStatus" slot-scope="{scope}">
        {{ scope.row.articleStatus | deployStatusFilter }}
      </template>
      <!--操作-->
      <template slot="operator" slot-scope="{scope}">
        <el-button v-if="scope.row.articleStatus == 1" type="primary" @click="inactive(scope.row)">
          下架
        </el-button>
        <el-button v-else type="primary" @click="deploy(scope.row)">
          发布
        </el-button>
        <el-button type="primary" @click.stop="edit(scope.row)">
          编辑
        </el-button>
        <el-button type="danger" @click.stop="Mixins_$Del(scope.row)">
          删除
        </el-button>
      </template>
    </base-table-layout>
    <base-dialog
      fullscreen
      :title="DialogForm['id']?'修改':'新增'"
      :visible.sync="Mixins_$DialogVisible"
      center
      @closed="reset"
    >
      <base-form ref="form" :model="DialogForm" :rules="dialogFormRules" label-width="120px" @submit="Mixins_$Submit" @cancel="Mixins_$DialogVisible = false">
        <el-form-item label="文章标题：" prop="title">
          <el-input v-model="dialogForm.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="文章位置" prop="place">
          <el-radio-group v-model="dialogForm.place">
            <el-radio v-for="(item, $index) in $Contants.toOptions($Contants.placeConstans)" :key="$index" :label="Number(item.value)">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章配图" prop="imgName">
          <base-upload
            ref="upload"
            :key="dialogForm.imgName"
            v-model="dialogForm.imgName"
            :file-size="2"
            :show-file-list="false"
          />
        </el-form-item>
        <el-form-item v-if="!dialogForm.id" label="是否立即发布：" prop="deliverIf">
          <el-switch
            v-model="dialogForm.deliverIf"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="文章内容" prop="articleContent">
          <tinymce ref="editor" :key="dialogForm.id" v-model="dialogForm.articleContent" :height="500" />
        </el-form-item>
      </base-form>
    </base-dialog>
  </div>
</template>
<script>
import { Mixins } from '@/mixins/mixins'
import ApiObject from '@/api/module/wechat/WechatArticleContentApi'
import Tinymce from '@/components/editor'
export default {
  name: 'WechatContent',
  components: { Tinymce },
  mixins: [Mixins],
  data() {
    return {
      timeRangeToCamelCase: true,
      pagination: false,
      ApiObject: ApiObject,
      dialogFormRules: {
        title: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        place: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        imgName: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        deliverIf: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        articleContent: [{ required: true, message: '必填项不能为空', trigger: 'change' }]
      },
      dialogForm: {
        title: '',
        place: '',
        imgName: '',
        deliverIf: 0,
        articleContent: ''
      },
      headers: [
        { label: '序号', type: 'index' },
        { label: '文章标题', prop: 'title' },
        { label: '位置', prop: 'place', format: this.$Contants.placeConstans },
        { label: '发布时间', prop: 'deliveryTime' },
        { label: '创建时间', prop: 'foundTime' },
        { label: '状态', prop: 'articleStatus', format: this.$Contants.deployStatus },
        { label: '操作', slot: 'operator' }
      ],
      queryParams: {
        place: '',
        articleStatus: '',
        timeRange: []
      }
    }
  },
  methods: {
    async inactive(obj) {
      await this.$confirm('确认下架?', '下架')
      const res = await ApiObject.inactive(obj.id)
      this.$message.success(res.message)
      this.init()
    },
    async deploy(obj) {
      await this.$confirm('确认发布?', '发布')
      const res = await ApiObject.deploy(obj.id)
      this.$message.success(res.message)
      this.$message.success(res.message)
      this.init()
    },
    getFinalDialogFormParams(data) {
      const params = { ...data }
      if (this.$utils.isString(params.imgName)) {
        params.imgName = params.imgName.split(',').map(item => {
          return {
            imgName: item,
            realName: item
          }
        })
      }
      return params
    },
    resetAfter() {
      this.$refs.editor.setContent('')
      this.$refs.upload.clearFiles()
    },
    editAfter() {
      this.dialogForm.imgName = this.dialogForm.imgName.map(item => item.imgName).join(',')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
