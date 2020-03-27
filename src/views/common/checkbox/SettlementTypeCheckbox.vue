<template>
  <base-checkbox-group v-bind="$attrs" :context="ApiObject" :api="ApiObject.getOptions" :query-params="queryParams" :placeholder="placeholder" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeSettlementApi'
export default {
  name: 'SettlementTypeCheckbox',
  props: {
    placeholder: {
      type: String,
      default: '请选择结算类型'
    }
  },
  data() {
    return {
      ApiObject,
      queryParams: 2
    }
  }
}
</script>

<style scoped>
</style>
