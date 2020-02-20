<template>
  <div class="summary-line">
    <div class="summary-label">
      {{ label }}
    </div>
    <slot>
      <div class="summary-text">
        {{ text }}
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'SummaryLine',
  props: {
    label: { type: String, default: '' },
    text: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
  .summary-line{
    line-height: 45px;
    height: 45px;
    display: flex;
    text-align: center;
    border: 1px solid #ececec;
    border-top-width: 0;
    font-size: 12px;
    color: #606266;
    .summary-label{
      width: 48px;
      border-right: 1px solid #ececec;
    }
    .summary-text{
      flex: 1;
    }
  }
</style>
