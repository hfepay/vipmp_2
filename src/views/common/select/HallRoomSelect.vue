<template>
  <base-select v-bind="$attrs" :context="ApiObject" :api="ApiObject.getOptions" :placeholder="placeholder" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeHallApi'
export default {
  name: 'HallRoomSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择厅房'
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
