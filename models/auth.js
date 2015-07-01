'use strict' 
var parse = require('co-body')

exports.auth = {
  //查询所有记录
  login: function *(){
    if (this.request.method === 'GET') {
      let content =  {title: 'login'} 
      return this.body = yield render('login', content)
    }
    if (this.request.method !== 'POST') return
    
    let body = yield parse(this)
    if (body.username !== 'chenliangxu'
      || body.password !== '123') return this.status = 400
    this.session.authenticated = true
    //console.log(this.session.authenticated) 
    this.redirect('/lines')
  },
 }
