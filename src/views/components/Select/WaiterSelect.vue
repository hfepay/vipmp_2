<template>
  <base-select
    v-bind="$attrs"
    :list="list"
    v-on="$listeners"
  />
</template>

<script>
import ObjectApi from '@/api/module/trade/TradeHallApi'
export default {
  name: 'WaiterSelect',
  data() {
    return {
      list: []
    }
  },
  async created() {
    this.list = [
      { label: '服务人员1', value: '1' },
      { label: '服务人员2', value: '2' },
      { label: '服务人员3', value: '3' }
    ]
  }
}
</script>
