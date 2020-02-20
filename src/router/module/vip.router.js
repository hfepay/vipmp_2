const router = [{
  path: '/vip',
  component: () => import('../../views/layout'),
  alwaysShow: true,
  meta: { title: '会员中心', icon: 'peoples' },
  children: [
    {
      path: 'card',
      name: 'Card',
      component: () => import('@/views/vip-center/card'),
      meta: { title: '会员卡种管理' }
    },
    {
      path: 'channel',
      name: 'Channel',
      component: () => import('@/views/vip-center/channel'),
      meta: { title: '渠道管理' }
    },
    {
      path: 'make',
      name: 'Make',
      component: () => import('@/views/vip-center/make'),
      meta: { title: '制卡管理' }
    },
    {
      path: 'cardLibrary',
      name: 'CardLibrary',
      component: () => import('@/views/vip-center/card-library'),
      meta: { title: '卡库管理' }
    },
    {
      path: 'payRecord',
      name: 'PayRecord',
      component: () => import('@/views/vip-center/pay-record'),
      meta: { title: '支付记录' }
    },
    {
      path: 'customerInfo',
      name: 'CustomerInfo',
      component: () => import('@/views/vip-center/customer-info'),
      meta: { title: '客户信息' }
    }
  ]
}]
export default router
