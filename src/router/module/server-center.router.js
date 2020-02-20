const router = [{
  path: '/serverCenter',
  component: () => import('../../views/layout'),
  redirect: 'noredirect',
  alwaysShow: true,
  meta: { title: '服务中心', icon: 'component' },
  children: [
    {
      path: 'cabin',
      name: 'CabinList',
      component: () => import('@/views/service-center/cabin'),
      meta: { title: '两舱服务' }
    },
    {
      path: 'regist',
      name: 'Regist',
      component: () => import('@/views/service-center/reception-register'),
      meta: { title: '接待登记' }
    },
    {
      path: 'hall',
      name: 'HallService',
      component: () => import('@/views/service-center/hall'),
      meta: { title: '厅室服务' }
    },
    {
      path: 'reserve',
      name: 'Reserve',
      component: () => import('@/views/service-center/reserve'),
      meta: { title: '预约记录' }
    },
    {
      path: 'reserveHistory',
      name: 'ReserveHistory',
      component: () => import('@/views/service-center/reserve-history'),
      meta: { title: '预约历史', noCache: true }
    },
    {
      path: 'recording',
      name: 'ServerCenterRecording',
      component: () => import('@/views/service-center/recording'),
      meta: { title: '记录复核' }
    }
  ]
}]
export default router
