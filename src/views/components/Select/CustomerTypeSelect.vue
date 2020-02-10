<template>
  <base-select
    v-bind="$attrs"
    placeholder="请选择客户类型"
    :list="list"
    v-on="$listeners"
  />
</template>

<script>
import ApiObject from '../../../api/module/trade/TradeSysCustomerTypeApi'
import Mixins from '../initList-mixins'
export default {
  name: 'CustomerTypeSelect',
  mixins: [Mixins],
  data() {
    return {
      ApiObject
    }
  }
}
</script>

<style scoped>

</style>
