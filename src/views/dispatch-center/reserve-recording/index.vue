<template>
  <div>
    <reserve type="dispatch-center" @dispatch="dispatch" />
    <dispatch-dialog v-model="DialogForm" :dialog-visible="dialogVisible" @closed="Mixins_$DialogVisible = false" />
  </div>
</template>
<script>
import Reserve from '../../service-center/reserve'
import DispatchDialog from '../../service-center/common/DispatchDialog'
// import DispatchApi from '../../../api/module/beDispatch/BeDispatchDispatchApi'
// import TaskApi from '../../../api/module/beDispatch/BeDispatchTaskApi'
import OverallApi from '../../../api/module/beDispatch/BeDispatchOverallApi'
export default {
  name: 'ReserveRecording',
  components: { Reserve, DispatchDialog },
  props: {},
  data() {
    return {
      dialogVisible: false,
      DialogForm: {},
      options: {}
    }
  },
  methods: {
    async dispatch(obj) {
      const res = await OverallApi.init(obj.id)
      this.dialogForm = { ...res.data }
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
</style>
