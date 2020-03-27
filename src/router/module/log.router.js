const router = [{
  path: '/log',
  component: () => import('../../views/layout'),
  alwaysShow: true,
  meta: { title: '日志记录', icon: 'list' },
  children: [
    {
      path: 'dialog-log',
      name: 'DialogLog',
      component: () => import('@/views/log/dialog-log'),
      meta: { title: '弹窗记录' }
    },
    {
      path: 'flight-records',
      name: 'FlightRecords',
      component: () => import('@/views/log/flight-records'),
      meta: { title: '航班记录' }
    }
  ]
}]
export default router
