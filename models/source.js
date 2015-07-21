'use strict' 
var parse = require('co-body')
var url = require('url')
var _ = require('underscore')

exports.client_source = {

  addSource: function *(){
    if (this.session.authenticated ) {
      if(this.request.method === 'POST') {
        let body = yield parse(this)

        try {
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


  showSources: function *() {
    if (this.session.authenticated ) {
        //watch params
        let param = url.parse(this.url, true).query
         console.log(param)
         let rows = yield GLOBAL.db.query('Select * from source')
         if(rows[0].length !== 0) {
            var europely = {
                 source_name : [],
                 created_at: [],
              }
            var ipiaoling = {
                 source_name : [],
                 created_at: [],
            }
            _.each(rows[0], function(source) {
              if (source.web == 'europely') {
                europely = add_source(source, europely)
              } else {
                ipiaoling = add_source(source, ipiaoling)
              }
            })
          }

          //edit the response of europely
          let res = stats_source(europely)
          europely['web'] = _.keys(res)
          europely['num_source'] = europely['web'].length
          europely['count'] =  _.values(res)
          europely['created_at'] = NaN

          //edit the response of ipiaoling
          res = stats_source(ipiaoling)
          ipiaoling['web'] = _.keys(res)
          ipiaoling['num_source'] = ipiaoling['web'].length
          ipiaoling['count'] =  _.values(res)
          ipiaoling['created_at'] = NaN
          //console.log(response)
          let content = {
            title : "Source",
            ipiaoling_source : ipiaoling,
            europely_source: europely,
          }
          console.log(content)
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
  response.source_name.push(source.source_name)
  response.created_at.push(new Date(source.created_at))
  return response
}

function stats_source(source) {
  let  totle_count = {}
  source.source_name.forEach(function(name) { 
     if (_.has(totle_count ,name)) { 
          totle_count[name] += 1
        } else {
          totle_count[name] = 1
        }
    })
  console.log(totle_count)
  return totle_count
}