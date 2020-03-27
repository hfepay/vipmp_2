const moduleName = '/assetCenter'

const router = [{
  path: moduleName,
  component: () => import('../../views/layout'),
  meta: { title: '资产中心', icon: 'tree-table' },
  children: [
    {
      path: 'materialInventory',
      name: 'MaterialInventory',
      component: () => import(`@/views${moduleName}/materialInventory`),
      meta: { title: '总仓物资库存' }
    },
    {
      path: 'generalWarehouse',
      name: 'GeneralWarehouse',
      component: () => import(`@/views${moduleName}/generalWarehouse`),
      meta: { title: '普通仓库库存' }
    },
    {
      path: 'hallWarehouse',
      name: 'HallWarehouse',
      component: () => import(`@/views${moduleName}/hallWarehouse`),
      meta: { title: '厅房仓库库存' }
    }
  ]
}]
export default router
