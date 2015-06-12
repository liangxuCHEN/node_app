/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes: for the app                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict'
var router = require('koa-router')()
var service = require('../models/user_service.js') 
var app_handler = require('../handlers-app.js')

//===========router setting==============
router
  .get('/', app_handler.get_index)
  .get('/users', service.users.findAll)
  .get('/users/:id', service.users.findByPK)
  .post('/show_trip', app_handler.show_trip)
  .get('/destination', app_handler.destination)

global.app.use(router.routes())