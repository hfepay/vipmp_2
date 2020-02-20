<template>
  <base-checkbox-group v-bind="$attrs" :context="ApiObject" :api="ApiObject.confPriceListOptions" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeHallApi'
export default {
  name: 'HallCheckbox',
  data() {
    return {
      ApiObject: ApiObject
    }
  }
}
</script>

<style scoped>
</style>
