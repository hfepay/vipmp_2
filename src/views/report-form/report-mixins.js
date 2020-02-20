const ReportMixins = {
  data() {
    return {
      summaryFields: [],
      summaryText: '小计'
    }
  },
  methods: {
    getSummaries({ columns, data }) {
      const sums = []
      // 会员人数:zkNum  随行人数:sxNum 做统计
      const propertys = this.summaryFields
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.summaryText
          return
        }
        const { property } = column
        if (propertys.includes(property)) {
          const count_arr = data.map(item => Number(item[property]))
          sums[index] = count_arr.length > 0 ? count_arr.reduce((cur, val) => cur + val) : 0
        }
      })
      return sums
    }
  }
}
export default ReportMixins
