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
  toOptions,
  loginConstant
}
