<template>
  <reception-select :query-params="queryParams" v-bind="$attrs" v-on="$listeners" />
</template>
<script>
import ReceptionSelect from './ReceptionSelect'
export default {
  name: 'BusinessTravelSelect',
  components: { ReceptionSelect },
  data() {
    return {
      queryParams: {
        datadictId: 1
      }
    }
  }
}
</script>

<style scoped>
</style>
