const SelectMixins = {
  methods: {
    refreshSelect() {
      this.$refs['select'].initOptions()
    }
  }
}

export default SelectMixins
