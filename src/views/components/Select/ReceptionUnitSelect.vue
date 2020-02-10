<template>
  <base-select
    v-bind="$attrs"
    filterable
    placeholder="请选择接待单位"
    :list="list"
    v-on="$listeners"
  />
</template>

<script>
import TradeReceptionUnitApi from '../../../api/module/trade/TradeReceptionUnitApi'

export default {
  name: 'ReceptionUnitSelect',
  props: {
    sysCustomerTypeCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    sysCustomerTypeCode: {
      immediate: true,
      handler: async function(newVal) {
        await this.initList()
        this.$emit('listChanged', this.list)
      }
    }
  },
  methods: {
    async initList() {
      if (this.sysCustomerTypeCode) {
        const list = await TradeReceptionUnitApi.getOptions({ sysCustomerTypeCode: this.sysCustomerTypeCode })
        this.list = list
      } else {
        this.list = []
      }
    }
  }
}
</script>

<style scoped>

</style>
