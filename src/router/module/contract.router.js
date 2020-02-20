const router = [{
  path: '/contract',
  component: () => import('../../views/layout'),
  alwaysShow: true,
  meta: { title: '合同管理', icon: 'clipboard' },
  children: [
    {
      path: 'airlineContract',
      name: 'AirlineContract',
      component: () => import('@/views/contract/airline-contract'),
      meta: { title: '航司合同汇总' }
    },
    {
      path: 'businessContract',
      name: 'BusinessContract',
      component: () => import('@/views/contract/business-contract'),
      meta: { title: '商旅合同汇总' }
    }
  ]
}]
export default router
