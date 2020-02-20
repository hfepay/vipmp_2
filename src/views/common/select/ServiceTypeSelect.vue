<template>
  <base-select v-bind="$attrs" :context="ApiObject" :api="ApiObject.getOptionsNameByType.bind(ApiObject, $Contants.DICTIONARY_ENUM.SERVER_TYPE)" :placeholder="placeholder" v-on="$listeners" />
</template>
<script>
import ApiObject from '../../../api/module/beTrade/BeTradeDatadictApi'
export default {
  name: 'ServiceTypeSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择服务类型'
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
