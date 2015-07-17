'use strict' 
var parse = require('co-body')

exports.client_source = {

  addSource: function *(){
    if (this.session.authenticated ) {
      if(this.request.method === 'POST') {
        let body = yield parse(this)

        try {
          body.count = 1
          let rows = yield GLOBAL.db.query('Insert Into source Set ?', values)
          this.redirect('/source')
        } catch (e) {
               switch (e.code) {
                   case 'ER_BAD_NULL_ERROR':
                   case 'ER_DUP_ENTRY':
                   case 'ER_NO_REFERENCED_ROW_2':
                   case 'ER_NO_DEFAULT_FOR_FIELD':
                       // recognised errors for use default MySQL messages for now
                       return this.throw (e.message, 403); // Forbidden
                   default:
                       return this.throw (e.message, 500); // Internal Server Error
               }
           }
      }
    } else {
        let content = {
           title: '登录系统',
           error_info: '没有足够权限',
        }
        this.body = yield render('/login', content)
    }
  },

  addCount: function *(){
    if (this.session.authenticated ) {
      if(this.request.method === 'GET') {
        let body = yield parse(this)
        console.log(body)
        console.log(this.params)
        try {
          let rows = yield GLOBAL.db.query('Updata from source Set ? Where source_id = ?', [body, body.source_id])
          this.redirect('/source')
        } catch (e) {
               switch (e.code) {
                   case 'ER_BAD_NULL_ERROR':
                   case 'ER_DUP_ENTRY':
                   case 'ER_NO_REFERENCED_ROW_2':
                   case 'ER_NO_DEFAULT_FOR_FIELD':
                       // recognised errors for use default MySQL messages for now
                       return this.throw (e.message, 403); // Forbidden
                   default:
                       return this.throw (e.message, 500); // Internal Server Error
               }
           }
      }
    } else {
        let content = {
           title: '登录系统',
           error_info: '没有足够权限',
        }
        this.body = yield render('/login', content)
    }
  },

  showSources: function *() {
    if (this.session.authenticated ) {
         let rows = yield GLOBAL.db.query('Select * from source')
         if(rows[0].length !== 0) {
            var europely = {
                 num_source : 0,
                 count : [],
                 source_name : [],
              }
            var ipiaoling = {
                 num_source : 0,
                 source_name : [],
                 count : [],
            }

            rows[0].forEach(function(source) {
              if (source.web == 'europely') {
                europely = add_source(source, europely)
              } else {
                ipiaoling = add_source(source, ipiaoling)
              }
            })
          }
          //console.log(response)
          let content = {
            title : "Source",
            ipiaoling_source : ipiaoling,
            europely_source: europely,
          }
          //console.log(content)
          this.body = yield render('show_source', content)
        } else {
          let content = {
              title: '登录系统',
              error_info: 'no',
           }
           this.body = yield render('/login', content)
        }
    },
 }

function add_source(source, response) {
  response.count.push(source.count)
  response.source_name.push(source.source_name)
  response.num_source += 1
  return response
}