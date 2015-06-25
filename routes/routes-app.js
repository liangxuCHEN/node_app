/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: for the app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict'
var router = require('koa-router')()
var service = require('../models/line_service.js') 
var app_handler = require('../handlers-app.js')

//===========router setting==============
router
  .get('/', app_handler.get_index)
  .get('/lines', service.lines.findAll)
  .get('/lines/:id', service.lines.findByPK)
  .get('/addLine', service.lines.addLine)
  .post('/addLine', service.lines.addLine)
  .post('/show_trip', app_handler.show_trip)
  .get('/destination', app_handler.destination)

global.app.use(router.routes())