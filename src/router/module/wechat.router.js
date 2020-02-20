const router = [{
  path: '/wechat',
  component: () => import('../../views/layout'),
  alwaysShow: true,
  meta: { title: '微信中心', icon: 'wechat' },
  children: [
    {
      path: 'account',
      name: 'WechatAccount',
      component: () => import('@/views/wechat/account'),
      meta: { title: '用户管理' }
    },
    {
      path: 'content',
      name: 'WechatContent',
      component: () => import('@/views/wechat/content'),
      meta: { title: '内容管理' }
    },
    {
      path: 'orderRecord',
      name: 'OrderRecord',
      component: () => import('@/views/wechat/order-record'),
      meta: { title: '订单管理' }
    },
    {
      path: 'productType',
      name: 'ProductType',
      component: () => import('@/views/wechat/product-type'),
      meta: { title: '产品类型管理' }
    },
    {
      path: 'product',
      name: 'Product',
      component: () => import('@/views/wechat/product'),
      meta: { title: '产品管理' }
    }
  ]
}]
export default router
