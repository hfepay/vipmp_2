<template>
  <base-select v-bind="$attrs" :context="ApiObject" :api="ApiObject.companyListOptions" :placeholder="placeholder" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeAircraftApi'
export default {
  name: 'CompanySelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择航司'
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
