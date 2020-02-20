<template>
  <base-select v-bind="$attrs" :context="ApiObject" :api="ApiObject.getOptionsByTypeWithoutBJD" :query-params="queryParams" :placeholder="placeholder" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeDatadictApi'
export default {
  name: 'CustomerTypeSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择客户类型'
    }
  },
  data() {
    return {
      ApiObject: ApiObject,
      queryParams: this.$Contants.DICTIONARY_ENUM.CUSTOMER_TYPE
    }
  }
}
</script>

<style scoped>
</style>
