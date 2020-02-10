<template>
  <base-select
    v-bind="$attrs"
    placeholder="请选择服务类型"
    :list="list"
    v-on="$listeners"
  />
</template>

<script>
import ApiObject from '../../../api/module/trade/TradeSysServiceTypeApi'
import Mixins from '../initList-mixins'
export default {
  name: 'ServiceTypeSelect',
  mixins: [Mixins],
  props: {
    params: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      ApiObject
    }
  }
}
</script>

<style scoped>

</style>
