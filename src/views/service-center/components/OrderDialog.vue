<template>
  <div>
    <base-dialog
      :title="form['id']?'修改':'新增'"
      :visible.sync="visible"
      center
      @closed="Mixins_$Reset"
    >
      <base-form
        ref="form"
        :model.sync="form"
        :inline="true"
        :rules="rules"
        @submit="Mixins_$Submit"
        @cancel="cancel"
      >
        <!--      客户信息-->
        <el-card header="客户信息">
          <el-form-item label="客户类型">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="接待单位">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="结算类型">
            <base-input v-model="form.name" />
          </el-form-item>
        </el-card>
        <!--      服务信息-->
        <el-card header="服务信息">
          <base-table
            :data="[{id: 'id',a: '', b: ''}]"
          >
            <el-table-column
              prop="id"
              label="服务类型"
            >
              <template slot-scope="scope">
                <base-input v-model="scope.row.id" />
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="服务厅房"
            >
              <template slot-scope="scope">
                <base-input v-model="scope.row.id" />
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="服务时长"
            >
              <template slot-scope="scope">
                <base-input v-model="scope.row.id" />
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="服务人数"
            >
              <template slot-scope="scope">
                <el-tooltip content="张三，李四" placement="right">
                  <span @click="showServedPeoples">2</span>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="服务金额"
            >
              <template slot-scope="scope">
                9999
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              width="120"
              label="优惠方式"
            >
              <template slot-scope="scope">
                <base-select
                  v-model="scope.row.a"
                  :list="offerTypeList"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="优惠金额/折扣"
            >
              <template slot-scope="scope">
                <base-input
                  v-model="scope.row.b"
                  :disabled="!scope.row.a"
                  :list="offerTypeList"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="结算金额"
            >
              <template slot-scope="scope">
                9999
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button>删除</el-button>
              </template>
            </el-table-column>
          </base-table>
          <el-button
            style="width: 100%;margin-top: 20px"
            type="primary"
            @click="Mixins_$AddService"
          >
            新增服务
          </el-button>
        </el-card>
        <!--      订单其他信息-->
        <el-card header="订单其他信息">
          <el-form-item label="出发/到达">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="卡号">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="签单人">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="接待时间">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="接机牌迎接语">
            <base-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="备注">
            <base-input v-model="form.name" />
          </el-form-item>
        </el-card>
        <!--      结算信息-->
        <el-card header="结算信息">
          <el-form-item label="合同总金额(元)">
            <base-input disabled />
          </el-form-item>
          <el-form-item label="结算总金额(元)">
            <base-input disabled />
          </el-form-item>
          <el-form-item label="优惠方式">
            <base-select v-model="form.a" :list="offerTypeList" />
          </el-form-item>
          <el-form-item label="优惠金额/折扣">
            <base-input v-model="form.b" :disabled="!form.a" />
          </el-form-item>
          <el-form-item label="订单金额(元)">
            <base-input disabled />
          </el-form-item>
          <el-form-item label="说明">
            <base-input v-model="form.name" type="textarea" />
          </el-form-item>
        </el-card>
      </base-form>
    </base-dialog>
    <base-dialog
      title="旅客信息"
      :visible.sync="servedPeoplesVisible"
      center
      @closed="servedPeoplesDialogClosed"
    >
      <base-input placeholder="扫描登机牌" style="width: 300px;margin-bottom: 20px">
        <template slot="append">
          <el-button type="primary" @click="Mixins_$AddPassenger">
            新增旅客
          </el-button>
        </template>
      </base-input>
      <base-table :data="[{id: '1'}]" :headers="passengerInforHeader" />
      <div style="text-align: center">
        <el-button type="primary" @click="confirmEditPassengers">
          确定
        </el-button>
        <el-button @click="cancelEditPassengers">
          取消
        </el-button>
      </div>
    </base-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: function() {
        return {
          serviceList: [],
          b: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {},
      servedPeoplesVisible: false,
      passengerInforHeader: [
        { label: '序号', type: 'index' },
        { label: '旅客姓名', type: 'input', prop: 'name' },
        { label: '身份证号', type: 'input', prop: 'name' },
        { label: '是否主客', type: 'input', prop: 'name' },
        { label: '登机牌', type: 'input', prop: 'name' },
        { label: '航班号', type: 'input', prop: 'name' },
        { label: '舱位', type: 'input', prop: 'name' },
        { label: '座位号', type: 'input', prop: 'name' },
        { label: '客票号', type: 'input', prop: 'name' },
        { label: '备注', type: 'input', prop: 'name' },
        { label: '操作', slot: 'operate' }
      ],
      offerTypeList: [{ label: '金额', value: '1' }, { label: '折扣', value: '2' }]
    }
  },
  methods: {
    confirmEditPassengers() {
      this.servedPeoplesVisible = false
    },
    cancelEditPassengers() {
      this.servedPeoplesVisible = false
    },
    servedPeoplesDialogClosed() {

    },
    addPassenger() {},
    showServedPeoples() {
      this.servedPeoplesVisible = true
    },
    addService() {
      this.form.serviceList.push(Object.create(null))
    },
    submit() {
      this.cancel()
    },
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>
