import BeTradeApi from './BeTradeApi'
class BeTradeReportApi extends BeTradeApi {
  constructor() {
    super('report')
  }
  slCustomerServe(data) {
    return super.customize_get('/slCustomerServe', data)
  }
  slCustomerServeExport(data) {
    return super.customize_export('/slCustomerServe/export', data)
  }

  slCustomerAmount(data) {
    return super.customize_get('/slCustomerAmount', data)
  }
  slCustomerAmountExport(data) {
    return super.customize_export('/slCustomerAmount/export', data)
  }

  slCompanySettlement(data) {
    return super.customize_get('/slCompanySettlement', data)
  }
  slCompanySettlementExport(data) {
    return super.customize_export('/slCompanySettlement/export', data)
  }

  PPCardPeople(data) {
    return super.customize_get('/PPCardPeople', data)
  }
  PPCardPeopleExport(data) {
    return super.customize_export('/PPCardPeople/export', data)
  }
  PPCabinPassenger(data) {
    return super.customize_get('/PPCabinPassenger', data)
  }
  PPCabinPassengerExport(data) {
    return super.customize_export('/PPCabinPassenger/export', data)
  }
  cabinACCustomerBill(data) {
    return super.customize_get('/cabinACCustomerBill', data)
  }
  cabinACCustomerBillExport(data) {
    return super.customize_export('/cabinACCustomerBill/export', data)
  }

  cabinSummary(data) {
    return super.customize_get('/cabinSummary', data)
  }
  cabinSummaryExport(data) {
    return super.customize_export('/cabinSummary/export', data)
  }

  cabinRegistration(data) {
    return super.customize_get('/cabinRegistration', data)
  }
  cabinRegistrationExport(data) {
    return super.customize_export('/cabinRegistration/export', data)
  }

  acLiquidation(data) {
    return super.customize_get('/qs/list', data)
  }
  acLiquidationExport(data) {
    return super.customize_export('/qs/export', data)
  }
  FirstClassIncome(data) {
    return super.customize_get('/firstClassIncome', data)
  }
  FirstClassIncomeExport(data) {
    return super.customize_export('/firstClassIncome/export', data)
  }
  configList(data) {
    return super.customize_get('/qs/configList', data)
  }
}

export default new BeTradeReportApi()
