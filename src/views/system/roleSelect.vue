<template>
  <el-checkbox-group v-model="value" v-bind="$attrs" v-on="$listeners">
    <el-checkbox v-for="(item,$index) in options" :key="$index" :label="item.value">
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
import ApiObject from '../../api/module/beAccount/BeAccountRoleApi'
export default {
  props: {
    value: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      options: {}
    }
  },
  async created() {
    this.options = await ApiObject.getOptions()
  }
}
</script>

<style scoped>
</style>
