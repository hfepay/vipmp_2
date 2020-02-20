const moduleName = '/memberCenter'

const router = [{
  path: moduleName,
  component: () => import('../../views/layout'),
  meta: { title: '会员中心', icon: 'tree-table' },
  children: [
    {
      path: 'cardManagement',
      name: 'CardManagement',
      component: () => import(`@/views${moduleName}/cardManagement`),
      meta: { title: '会员卡种管理' }
    },
    {
      path: 'cardLibrary',
      name: 'CardLibrary',
      component: () => import(`@/views${moduleName}/cardLibrary`),
      meta: { title: '卡库管理' }
    }
  ]
}]
export default router
