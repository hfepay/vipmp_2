<template>
  <base-select v-bind="$attrs" :context="ApiObject" :api="ApiObject.getOptions" :placeholder="placeholder" :query-params="queryParams" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeReceiveOrgApi'
export default {
  name: 'ReceptionSelect',
  components: {},
  props: {
    placeholder: {
      type: String,
      default: '请选择商旅公司'
    },
    queryParams: {
      type: Object,
      default: function() {
        return {}
      }
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
