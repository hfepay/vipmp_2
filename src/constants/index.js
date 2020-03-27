/* const data = require.context('./module', false, /\.constant\.js$/)
const $MODULE_CONSTANS = {}
data.keys().forEach(fileName => {
  $MODULE_CONSTANS[getKey(fileName)] = data(fileName).default
})

function getKey(str) {
  return str.match(/^(.\/)(.*)(.constant.js)$/)[2]
}*/

const loginConstant = {
  grant_type: 'password',
  scope: 'app',
  client_id: 'app',
  client_secret: 'app@2018'
}
const data = require.context('./module', false, /\.constant\.js$/)
const $MODULE_CONSTANS = {}
data.keys().forEach(fileName => {
  $MODULE_CONSTANS[getKey(fileName)] = data(fileName).default
})

// ./[name].constants.js

function getKey(str) {
  return str.match(/^(.\/)(.*)(.constant.js)$/)[2]
}
const reviewSecondType = { 0: '未复核', 1: '已复核' }
const reviewType = { 0: '未审核', 1: '已审核' }
const dispatchTaskStatus = {
  0: '待接收',
  1: '已接收',
  2: '已完成',
  3: '已取消',
  4: '已删除',
  5: '其他'
}
const serviceStatus = { 0: '服务中', 1: '已完成' }
const whetherType = { 0: '否', 1: '是' }
const reserveChannel = {
  0: '其它',
  1: '微信小程序 '
}
const RESERVECHANNEL_ENUM = {
  'OTHER': 0,
  'WECHAT': 1
}
const reserveStatus = {
  0: '新建 ',
  1: '已接待 ',
  2: '已取消'
}
const flightType = { 0: '进港', 1: '出港' }
const serviceTimeOptions = { 0: '不限时', 2: '2小时' }
const statusConstans = { Y: '启用', N: '停用' }
const placeConstans = { '0': '列表', '1': 'banner' }
const deployStatus = { 0: '未发布', 1: '已发布' }
const productTypeSatus = { 0: '未发布', 1: '已发布' }
const dictionaryType = {
  1: '厅房区域',
  2: '客户类型',
  3: '服务类型',

  5: '调度任务类型',
  6: '固定资产类型'
}
const dispatchOrderStatus = {
  ALLOCATED: '已分配',
  RECIEVED: '已接收',
  COMPLETED: '已完成',
  CANCEL: '已取消'
}
const contractStatus = { 1: '生效', 2: '失效', 3: '未生效' }
// 订单状态 1待支付 2已取消 3支付成功 4已退款 5已使用
const orderStatus = {
  1: '待支付',
  2: '已取消',
  3: '支付成功',
  4: '已退款',
  5: '已使用 '
}
const cardStatus = {
  0: '未激活',
  1: '已激活',
  2: '已失效',
  3: '已冻结'
}
const ownerTypeRule = {
  0: '个人',
  1: '企业单位'
}
const validationRule = {
  0: '到期卡失效',
  1: '到期权益失效'
}
const tradingStatus = {
  0: '支付成功',
  1: '退款成功'
}
const orderType = {
  0: '支付',
  1: '退款'
}
const assetStatus = {
  1: '已报废',
  2: '未到期',
  3: '已到期'
}
const followerCount = Object.assign({}, [...Array(10).keys()], { '': '不限' })
const payType = { 1: '微信支付', 2: '支付宝', 3: '珠海机场会员卡' }
// 失效规则 0:到期卡失效 1:到期权益失效
const invalidRule = { 0: '到期卡失效', 1: '到期权益失效' }
const valiableStatus = { 0: '未激活', 1: '已激活', 2: '已失效', 3: '已冻结' }
const cardOwnerType = { 0: '个人', 1: '企业单位' }
// 预订方类型 0:企业单位 1:个人
const reserverType = { 0: '企业单位', 1: '个人' }
const stockOperateType = { 0: '出库', 1: '入库' }
const sexType = { 0: '女', 1: '男' }
const messageCode = { 0: '发送成功', 1: '发送失败', '': '全部' }

/* 字典类型枚举 */
const DICTIONARY_ENUM = {
  HALL_AREA: 1,
  CUSTOMER_TYPE: 2,
  SERVER_TYPE: 3,
  PROCESS_NODE: 4,
  DISPATER_TYPE: 5,
  DATADUCT_ID: 2,
  DATADUCT_ASSET: 6
}
const financialTypes = {
  1: 'VIP旅客',
  2: 'CIP旅客',
  3: '持卡旅客',
  4: '头等舱旅客'
}

const registrationLocation = {
  1: '接待登记',
  2: '两舱登记'
}
const taskStatus = {
  '0': '待接收',
  '1': '进行中',
  '2': '已完成'
}
// 常量转为下拉选项
// [{label:label,value:value}]
const toOptions = val => {
  return val
    ? Object.keys(val).map(item => {
      return {
        label: val[item],
        value: item
      }
    })
    : {}
}

export default {
  $MODULE_CONSTANS,
  toOptions,
  DICTIONARY_ENUM,
  deployStatus,
  placeConstans,
  registrationLocation,
  loginConstant,
  sexType,
  orderStatus,
  cardStatus,
  ownerTypeRule,
  validationRule,
  reviewType,
  reserverType,
  statusConstans,
  dispatchTaskStatus,
  serviceStatus,
  invalidRule,
  dispatchOrderStatus,
  whetherType,
  flightType,
  reviewSecondType,
  dictionaryType,
  reserveStatus,
  payType,
  taskStatus,
  reserveChannel,
  orderType,
  assetStatus,
  financialTypes,
  serviceTimeOptions,
  contractStatus,
  followerCount,
  productTypeSatus,
  valiableStatus,
  cardOwnerType,
  messageCode,
  tradingStatus,
  RESERVECHANNEL_ENUM,
  stockOperateType
}

