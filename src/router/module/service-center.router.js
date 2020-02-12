const router = [{
  path: '/service-center',
  component: () => import('../../views/layout'),
  meta: { title: '服务中心' },
  children: [
    {
      path: 'reception-register',
      name: 'ReceptionRegister',
      component: () => import('@/views/service-center/reception-register'),
      meta: { title: '接待登记' }
    }
  ]
}]
export default router
