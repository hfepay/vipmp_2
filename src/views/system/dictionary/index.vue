<template>
  <el-tabs type="border-card">
    <el-tab-pane label="字典管理">
      <dictionary-tab />
    </el-tab-pane>
    <el-tab-pane label="航空公司维护表">
      <airline-tab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import DictionaryTab from './dictionary-tab'
import AirlineTab from './airline-tab'
export default {
  name: 'Dictionary',
  components: { AirlineTab, DictionaryTab }
}
</script>

<style scoped>

</style>
