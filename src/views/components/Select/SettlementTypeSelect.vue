<template>
  <base-select
    v-bind="$attrs"
    placeholder="请选择选择类型"
    :list="list"
    v-on="$listeners"
  />
</template>

<script>
import ApiObject from '../../../api/module/trade/TradeSysSettlementTypeApi'
export default {
  name: 'SettlementTypeSelect',
  props: {
    customerTypeCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      ApiObject,
      list: []
    }
  },
  watch: {
    customerTypeCode: async function(newVal) {
      if (newVal) {
        await this.initList()
      } else {
        this.list = []
      }
      this.$emit('listChanged', this.list)
    }
  },
  methods: {
    async initList() {
      const res = await ApiObject.findByCustomerTypeCode(this.customerTypeCode)
      this.list = ApiObject.toOptions(res.data, { value: 'code', label: 'name' })
      return true
    }
  }
}
</script>

<style scoped>

</style>
