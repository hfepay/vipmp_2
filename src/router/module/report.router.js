const router = [{
  path: '/report',
  component: () => import('../../views/layout'),
  redirect: 'noredirect',
  meta: { title: '财务报表', icon: 'documentation' },
  children: [
    {
      path: 'businessTravelServiceDetail',
      name: 'BusinessTravelServiceDetail',
      component: () => import('@/views/report-form/business-travel-service-detail'),
      meta: { title: '商旅客户服务明细表' }
    },
    {
      path: 'businessTravelFeeDetail',
      name: 'BusinessTravelFeeDetail',
      component: () => import('@/views/report-form/business-travel-fee-detail'),
      meta: { title: '商旅客户费用汇总表' }
    },
    {
      path: 'businessTravelSettleOrder',
      name: 'BusinessTravelSettleOrder',
      component: () => import('@/views/report-form/business-travel-settle-order'),
      meta: { title: '商旅公司结算单' }
    },
    {
      path: 'PPcardPeople',
      name: 'PPCardPeople',
      component: () => import('@/views/report-form/ppcard-people'),
      meta: { title: 'PP卡人数汇总' }
    },
    {
      path: 'PPcardTDC',
      name: 'PPcardTDC',
      component: () => import('@/views/report-form/ppcard-tdc'),
      meta: { title: 'PP卡使用头等舱登记表' }
    },
    {
      path: 'firstClass',
      name: 'FirstClass',
      component: () => import('@/views/report-form/first-class'),
      meta: { title: '头等舱汇总表' }
    },
    {
      path: 'passengerUsageRecordReport',
      name: 'PassengerUsageRecordReport',
      component: () => import('@/views/report-form/passenger-usage-record-report'),
      meta: { title: '头等舱旅客使用登记表' }
    },
    {
      path: 'incomeReport',
      name: 'IncomeReport',
      component: () => import('@/views/report-form/income-report'),
      meta: { title: '头等舱收入汇总表' }
    },
    {
      path: 'orderReport',
      name: 'OrderReport',
      component: () => import('@/views/report-form/order-report'),
      meta: { title: '两舱航司客户账单' }
    },
    {
      path: 'liquidationReport',
      name: 'LiquidationReport',
      component: () => import('@/views/report-form/liquidation-report'),
      meta: { title: '航司清算报表' }
    }
  ]
}]
export default router
