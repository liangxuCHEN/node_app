/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: for the app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict'
var router = require('koa-router')()
var service = require('../models/line_service.js')
var service_comment = require('../models/client_comment.js')
var authService = require('../models/auth.js')  
var app_handler = require('../handlers-app.js')

//===========router setting==============
router
  .get('/', app_handler.get_index)
  .get('/lines', service.lines.findAll)
  .get('/lines/:id', service.lines.findByPK)
  .post('/lines/:id', service.lines.findByPK)
  .get('/addLine', service.lines.addLine)
  .post('/addLine', service.lines.addLine)
  .post('/show_trip', service.lines.show_trip)
  .get('/destination', app_handler.destination)
  .get('/login', authService.auth.login)
  .post('/login', authService.auth.login)
  .get('/comment/:id', service_comment.comments.checkComment)
  .post('/addComment', service_comment.comments.addComment)
  .get('/comments', service_comment.comments.findAll)
  .get('/notCheckComments', service_comment.comments.findAllNotCheck)
  .get('/admin', app_handler.admin_page)

global.app.use(router.routes())