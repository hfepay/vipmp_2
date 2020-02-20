const router = [{
  path: '/dispatchCenter',
  component: () => import('../../views/layout'),
  alwaysShow: true,
  redirect: 'noredirect',
  meta: { title: '调度中心', icon: 'international' },
  children: [
    {
      path: 'operatingStatus',
      name: 'OperatingStatus',
      component: () => import('@/views/dispatch-center/operating-status'),
      meta: { title: '运行状态' }
    },
    {
      path: 'reserveRecording',
      name: 'ReserveRecording',
      component: () => import('@/views/dispatch-center/reserve-recording'),
      meta: { title: '全流程预约记录' }
    },
    {
      path: 'staffScheduling',
      name: 'StaffScheduling',
      component: () => import('@/views/dispatch-center/staff-scheduling'),
      meta: { title: '人员排班' }
    },
    {
      path: 'scheduleHistory',
      name: 'ScheduleHistory',
      component: () => import('@/views/dispatch-center/schedule-history'),
      meta: { title: '历史排班记录' }
    },
    {
      path: 'dispatchRecording',
      name: 'DispatchRecording',
      component: () => import('@/views/dispatch-center/dispatch-recording'),
      meta: { title: '调度任务记录' }
    },
    {
      path: 'receiveRecords',
      name: 'ReceiveRecords',
      component: () => import('@/views/dispatch-center/receive-records'),
      meta: { title: '接机保障记录' }
    },
    {
      path: 'vipRecording',
      name: 'VipRecording',
      component: () => import('@/views/dispatch-center/vip-recording'),
      meta: { title: '贵宾保障记录' }
    },
    {
      path: 'politicalDignitary',
      name: 'PoliticalDignitary',
      component: () => import('@/views/dispatch-center/political-dignitary'),
      meta: { title: '政要保障记录' }
    },
    {
      path: 'send',
      name: 'SendMessage',
      component: () => import('@/views/message/send'),
      meta: { title: '发送短信' }
    },
    {
      path: 'records',
      name: 'MessageRecords',
      component: () => import('@/views/message/records'),
      meta: { title: '短信记录' }
    },
    {
      path: 'addressBook',
      name: 'AddressBook',
      component: () => import('@/views/message/address-book'),
      meta: { title: '通讯录管理' }
    },
    {
      path: 'template',
      name: 'MessageTemplate',
      component: () => import('@/views/message/template'),
      meta: { title: '模板管理' }
    }
  ]
}]
export default router
