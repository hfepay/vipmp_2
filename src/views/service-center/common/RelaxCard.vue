<template>
  <!--休息卡-->
  <div class="print-relax-container">
    <div class="relax-card-header">
      贵宾卡
    </div>
    <div class="relax-card-content">
      <table border="1" style="width: 100%" cellpadding="4">
        <tr v-for="(head, $index) in headers" :key="$index">
          <td>
            {{ head.CN }}({{ head.EN }})
          </td>
          <td>{{ getText(head.key) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RelaxCard',
  components: {},
  props: {
    dialogForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { CN: '旅客姓名', EN: 'NAME', key: 'name' },
        { CN: '使用厅房', EN: 'ROOM', key: 'hallCN' },
        { CN: '航班号', EN: 'FLT', key: 'flightCode' },
        { CN: '座位号', EN: 'SEAT', key: 'seatNum' },
        { CN: '日期', EN: 'DATE', key: 'serveDate' },
        { CN: '舱位', EN: 'CLASS', key: 'cabinLevel' },
        { CN: '类型', EN: 'TYPE', key: 'settlementCN' },
        { CN: '机号', EN: ' DEVICE NO', key: 'aircraftCode' },
        { CN: '卡号', EN: 'CARD NO', key: 'settlementCardNum' }
      ]
    }
  },
  computed: {
    getText() {
      return function(key) {
        return key === 'serveDate' ? (this.dialogForm[key] ? this.$moment(this.dialogForm[key]).format('YYYY-MM-DD') : '') : this.dialogForm[key]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  $printContainerDistance:10px;
  .print-relax-container{
    // padding: $printContainerDistance;
    background-color: darkgray;
    width: fit-content;
    height: 227px;
    color: black;
    border: 1px solid black;
  .relax-card-header{
    text-align: center;
    color: black;
    font-size: 10px;
    line-height: 26px;
    // margin-bottom: $printContainerDistance
  }
  .relax-card-content{
    background-color: white;
    td{
      font-size: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  }
</style>
