const router = [{
  path: '/system',
  component: () => import('../../views/layout'),
  redirect: 'noredirect',
  meta: { title: '基础设置', icon: 'tree' },
  children: [
    {
      path: 'servicePrice',
      name: 'ServicePrice',
      component: () => import('@/views/system/service-price'),
      meta: { title: '服务价格' }
    },
    {
      path: 'settleType',
      name: 'SettleType',
      component: () => import('@/views/system/settle-type'),
      meta: { title: '结算类型' }
    },
    {
      path: 'receptionUnit',
      name: 'ReceptionUnit',
      component: () => import('@/views/system/reception-unit'),
      meta: { title: '接待单位' }
    },
    {
      path: 'flightCompanyLiquidation',
      name: 'FlightCompanyLiquidation',
      component: () => import('@/views/system/flight-company-liquidation'),
      meta: { title: '航司清算项目' }
    },
    {
      path: 'liquidationProject',
      name: 'LiquidationProject',
      component: () => import('@/views/system/liquidation-project'),
      meta: { title: '清算项目管理' }
    },
    {
      path: 'exceptByTwoWordCode',
      name: 'ExceptByTwoWordCode',
      component: () => import('@/views/system/except-by-two-word-code'),
      meta: { title: '二字码搜索排除项' }
    },
    {
      path: 'airplaneInfo',
      name: 'AirplaneInfo',
      component: () => import('@/views/system/airplane-info'),
      meta: { title: '机号信息' }
    },
    /* {
      path: 'flightCompany',
      name: 'FlightCompany',
      component: () => import('@/views/system/flight-company'),
      meta: { title: '航空公司' }
    },*/
    {
      path: 'terminal',
      name: 'Terminal',
      component: () => import('@/views/system/terminal'),
      meta: { title: '手持终端' }
    },
    {
      path: 'hallManager',
      name: 'HallManager',
      component: () => import('@/views/system/hall-manager'),
      meta: { title: '厅房管理' }
    },
    {
      path: 'dictionary',
      name: 'Dictionary',
      component: () => import('@/views/system/dictionary'),
      meta: { title: '字典管理' }
    }
  ]
}]
export default router
