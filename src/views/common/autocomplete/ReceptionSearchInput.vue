<template>
  <base-autocomplete
    v-bind="$attrs"
    :context="ReceiveOrgApi"
    :api="ReceiveOrgApi.getOptionsName"
    :placeholder="placeholder"
    v-on="$listeners"
  />
</template>
<script>
import ReceiveOrgApi from '../../../api/module/beTrade/BeTradeReceiveOrgApi'
export default {
  name: 'ReceptionSearchInput',
  components: {},
  props: {
    placeholder: {
      type: String,
      default: '请输入接待单位'
    }
  },
  data() {
    return {
      ReceiveOrgApi: ReceiveOrgApi
    }
  }
}
</script>

<style scoped>
</style>
