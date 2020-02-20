const router = [{
  path: '/settlement',
  component: () => import('../../views/layout'),
  alwaysShow: true,
  redirect: 'noredirect',
  meta: { title: '结算中心', icon: 'excel' },
  children: [
    {
      path: 'financeReview',
      name: 'FinanceReview',
      component: () => import('@/views/settlement-center/finance-review'),
      meta: { title: '财务审核' }
    }
  ]
}]
export default router
