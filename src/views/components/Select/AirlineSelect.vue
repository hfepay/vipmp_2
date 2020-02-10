<template>
  <base-select
    v-bind="$attrs"
    filterable
    placeholder="按航司名称查询"
    :list="list"
    v-on="$listeners"
  />
</template>

<script>
import ApiObject from '@/api/module/trade/TradeReceptionUnitApi'
import Mixins from '../initList-mixins'
export default {
  name: 'AirlineSelect',
  mixins: [Mixins],
  data() {
    return {
      ApiObject
    }
  }
}
</script>
