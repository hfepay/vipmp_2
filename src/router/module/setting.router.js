const moduleName = '/setting'

const router = [{
  path: moduleName,
  component: () => import('../../views/layout'),
  meta: { title: '基本设置', icon: 'tree-table' },
  children: [
    {
      path: 'dept',
      name: 'Dept',
      component: () => import(`@/views${moduleName}/dept`),
      meta: { title: '部门管理' }
    },
    {
      path: 'menuConfig',
      name: 'MenuConfig',
      component: () => import(`@/views${moduleName}/menuConfig`),
      meta: { title: '菜单管理' }
    }
  ]
}]
export default router
