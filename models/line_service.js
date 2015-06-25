'use strict' ;
var parse = require('co-body')

exports.lines = {
  //查询所有记录
  findAll: function *(){
    if (this.session.authenticated) {
      //执行sql返回结果
      let rows = yield  GLOBAL.db.query('select * from line_euro')

      if(rows[0].length !== 0){
        var response = {
              num_lines : rows[0].length,
              line_id: [],
              urls : [],
              name_line : [],
              price: [],
              actived:[],
              day:[],
              destination:[],
          }
          
        rows[0].forEach(function(line) {
          response = add_line(line, response)
        })
      }
      console.log(response)
      let content = {
        advices : response,
        title : "All lines",
      }
      this.body = yield render('show_all_lines', content)
    } else {
      this.redirect('/login')
    }
  },

  //按主键查询
  findByPK: function *(){
   if (this.session.authenticated) {
     //update the line
        if(this.method == 'POST') {
         let values = yield parse(this, {limit: '1kb'} )
         console.log(values)
         try {
            yield GLOBAL.db.query('Update line_euro Set ? Where line_id = ?', [values, values.line_id])
            this.redirect('/lines')
        } catch (e) {
            switch (e.code) {
                case 'ER_BAD_NULL_ERROR':
                case 'ER_DUP_ENTRY':
                case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
                case 'ER_ROW_IS_REFERENCED_2':
                case 'ER_NO_REFERENCED_ROW_2':
                    // recognised errors for Member.update - just use default MySQL messages for now
                    return this.throw (e.message, 403); // Forbidden
                default:
                    return this.throw (e.message, 500); // Internal Server Error
            }
          }  
        }

      if(this.method == 'GET') {
         let rows = yield GLOBAL.db.query('select * from line_euro where line_id=?', this.params.id)
         console.log(rows)
         if(rows[0].length==0){
            //抛出异常，并返回http status 404
            console.log('no found')
            return this.throw(this.params.id + '数据未找到', 404);
          } else {
             let content = {
               line_id: rows[0][0].line_id,
               name_cn: rows[0][0].name_cn,
               url_line: rows[0][0].site,
               day: rows[0][0].day,
               price: rows[0][0].price,
               actived: rows[0][0].active,
               destination: rows[0][0].destination,
               title : "edit line",
             }
             this.body = yield render('show_line', content)
          }
        } 
    } else {
       this.redirect('/login')
    }
},

  //add the line
  addLine: function *() {
    if (this.session.authenticated) {
       if(this.method == 'POST') {
         let values = yield parse(this, {limit: '1kb'} )
         console.log(values) 
         try {
               let result = yield GLOBAL.db.query('Insert Into line_euro Set ?', values);
               console.log('line', result.insertId, new Date); // 
               this.body = result[0].insertId;
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

        if(this.method == 'GET') {
          let content = {title: '添加路线'}
          this.body  = yield render('addLine', content)
        }
    } else {
      this.redirect('/login')
    }
  },

  //delete the line
  deleteLine: function *(){
  if (this.session.authenticated) {
    try {
        yield GLOBAL.db.query('Delete From line_euro Where id = ?', this.params.id)
        this.redirect('/lines')
    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in TeamMember
              return this.throw('Member belongs to team(s)', 403); // Forbidden
            default:
              return this.throw(e.message, 500); // Internal Server Error
        }
    }
  } else {
    this.redirect('/login')
  }
  },

//find the propro line
 show_trip: function *() {
    if(this.method !== 'POST') return yield next
      var response = {
            num_lines : 0,
            line_id: [],
            urls : [],
            name_line : [],
            price: [],
            actived:[],
            day:[],
            destination:[],
        }
      let body = yield parse(this, {limit: '1kb'} )
     if (body.destination == null ) return response
     switch(body.days_trip) {
       case '1': 
         var rows = yield GLOBAL.db.query('select * from line_euro where day>? and day<?', [0, 2])
         if(rows[0].length !== 0) {
           response = find_line_by_destination(body.destination, rows[0], response)
          }
         break
       case '2': 
         response = middle_trip_advice(1, 6, response) 
         break
       default:
          response = long_trip_advice(5, 100, response) 
        break
     }
      let content = {
        advices : response,
        title : "路线推荐",
      }
     this.body = yield render('show_trip', content)
   },
};

function find_line_by_destination(destinations, lines, response) {
  lines.forEach(function(line) {
    
    destinations.forEach(function (destination) {
      console.log(destination)
      if(line.destination == destination) { 
        response.num_lines +=1
        response = add_line(line, response)
      }
    })
  })
  return response
}

function add_line(line, response) {
  response.urls.push(line.site)
  response.name_line.push(line.name_cn)
  if (line.price !== null && line.price !==0 )  {
    response.price.push("约" + line.price)
  } else {
    response.price.push("请询价")
  }
  response.line_id.push(line.line_id)
  response.actived.push(line.active)
  response.day.push(line.day)
  response.destination.push(line.destination)
  return response
}