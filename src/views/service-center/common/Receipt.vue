<template>
  <!--自费收据样板：-->
  <div class="self-pay-receipt-container">
    <div>
      <div class="self-pay-receipt-header">
        {{ dialogForm.title }}
      </div>
      <div class="self-pay-receipt-time_no">
        单位:{{ dialogForm.name }}
      </div>
      <table border="1" style="margin: 10px 0" cellpadding="5" align="center" valign="middle">
        <thead>
          <tr v-for="(head, $index) in headers" :key="$index">
            <th v-for="(row,index) in head.rows" :key="index" :rowspan="row.rowspan" :colspan="row.colspan">
              {{ row.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, $index) in finalList" :key="$index">
            <!--日期-->
            <td>{{ item.date }}</td>
            <!--航班号-->
            <td>{{ item.flightCode }}</td>
            <!--获接待来宾单位-->
            <td>{{ item.companyName }}</td>
            <!--散客数量-->
            <td>{{ item.sk }}</td>
            <!--单价-->
            <td>{{ item.skPrice }}</td>
            <!--包厅-->
            <td>{{ item.bt }}</td>
            <!--单价-->
            <td>{{ item.btPrice }}</td>
            <!--接机-->
            <td>{{ item.zrjj }}</td>
            <!--单价-->
            <td>{{ item.zrjjPrice }}</td>
            <!--贵宾车-->
            <td>{{ item.zcjj }}</td>
            <!--单价-->
            <td>{{ item.zcjjPrice }}</td>
            <!--合计（元）-->
            <td>{{ item.amount }}</td>
            <!--付款方式-->
            <td>{{ item.settlement }}</td>
            <!--客票号-->
            <td v-if="$index === 0" rowspan="5">
              {{ item.cashPay }}
            </td>
          </tr>
          <tr>
            <td colspan="14">
              总计金额:{{ dialogForm.totalAmount }}
            </td>
          </tr>
        </tbody>
      </table>
      <el-row>
        <el-col :span="6">
          审核人：
        </el-col>
        <el-col :span="6">
          会计：
        </el-col>
        <el-col :span="6">
          出纳：
        </el-col>
        <el-col :span="6">
          经手人：
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Receipt',
  props: {
    DialogForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      Headers: [
        {
          rows: [
            { label: '日期', rowspan: 2 },
            { label: '航班号', rowspan: 2 },
            { label: '获接待来宾单位', rowspan: 2 },
            { label: '服务项目', colspan: 8 },
            { label: '合计金额(元)', rowspan: 2 },
            { label: '付款方式', rowspan: 2 },
            { label: '发票号', rowspan: 2 }
          ]
        },
        {
          rows: [
            { label: '散客' },
            { label: '单价' },
            { label: '包厅' },
            { label: '单价' },
            { label: '接机' },
            { label: '单价' },
            { label: '贵宾车' },
            { label: '单价' }
          ]
        }
      ]
    }
  },
  computed: {
    finalList() {
      const result = []
      for (let i = 0; i < 5; i++) {
        const obj = this.dialogForm.list[i] || {}
        result.push(obj)
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
  .self-pay-receipt-container{
    font-weight: lighter;
    // border: 1px solid black;
    // padding: 0 10px 10px 10px;
    // width: 680px;
    // line-height: 30px;
    // height: 100vh;
    display: flex;
    justify-content: center;
    // align-items: center;
    box-sizing: border-box;
    padding: 0 10px;
  .self-pay-receipt-header{
    text-align: center;
    font-size: 20px;
  }
  .self-pay-receipt-time_no{
  }
    table{
      font-size: 10px;
      height: 350px;
    }
    th{
      // white-space: nowrap;
      font-weight: inherit;
    }
    tr{
    }
  }
</style>
