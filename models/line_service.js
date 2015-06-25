'use strict' ;
var parse = require('co-body')

exports.lines = {
  //查询所有记录
  findAll: function *(){
    //执行sql返回结果
    let rows = yield  GLOBAL.db.query('select * from line_euro')
    this.body = rows[0] ;
  },

  //按主键查询
  findByPK: function *(){
   //执行sql返回结果
   //let sql = `Select * From Member Where ${field} = ? Order By Firstname, Lastname`
   console.log(this.params.id)
   let rows = yield GLOBAL.db.query('select * from line_euro where id=?', this.params.id)
   //console.log(rows)
   if(rows[0].length==0){
     //抛出异常，并返回http status 404
     console.log('no found')
     return this.throw(id + '数据未找到', 404);
   }
   let line = rows[0][0] ;
   this.body = line;
  },

  //add the line
  addLine: function *(){
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
  },

  //add the line
  deleteLine: function *(){
    try {
        yield GLOBAL.db.query('Delete From line_euro Where id = ?', this.params.id);
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
  },
};
