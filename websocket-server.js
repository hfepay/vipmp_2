var ws = require('nodejs-websocket')
ws.createServer(function(conn) {
  console.log('有新连接')
  setInterval(function() {
    conn.sendText(Date.now() + '')
  }, 5000)
  // 获取连接信息
  conn.on('text', function(str) {
    console.log('接收到的数据 ' + str)
    // conn.sendText(str)
  })

  // 断开连接的回调
  conn.on('close', function(code, reason) {
    console.log('Connection closed')
  })

  // 处理错误事件信息
  conn.on('error', function(err) {
    console.log('throw : err')
    console.log(err)
  })
}).listen(8001)
