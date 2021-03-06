var path = require('path')
var jsonServer = require('json-server')
var server = jsonServer.create()
var db = require('./database.js')();
var router = jsonServer.router(db)
var middlewares = jsonServer.defaults({static: __dirname})
var common = require('./js/common/common')

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
// server.get('/api/account', (req, res) => {
//   res.send('403', {error: '你被禁止访问。'});
// })

// 拦载用户管理下的删除、修改操作
// server.all(common.prefix + '/users/*', (req, res) => {
//   res.status(201).json({});
// })

// 重定向
// server.all(common.prefix + '/*', (req, res) => {
//   res.redirect(301, 'http://172.30.60.181:8080/api/' + req.params[0]);
// })

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Use default router
server.use(common.prefix, router)

// Startup
server.listen(3000, function() {
  console.log('JSON Server is running. [Listening at http://localhost:3000]')
})
