<template>
  <base-select v-bind="$attrs" :context="ApiObject" :api="ApiObject.getOptions" :placeholder="placeholder" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeAirlineProjectApi'
export default {
  name: 'LiquidationProjectSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择航司用户'
    }
  },
  data() {
    return {
      ApiObject: ApiObject
    }
  }
}
</script>

<style scoped>
</style>
