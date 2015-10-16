'use strict'
var parse = require('co-body')

exports.email = {
  sendMails: function *() {
      /*let rows = yield  GLOBAL.db.query('select * from line_euro')

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
      }*/
      if(this.method == 'POST') {
      	let values = yield parse(this, {limit: '5kb'} )
      	console.log(values)
      	let email_list = ['lchen@europely.com']
      	let message = {
      		title : values.email_title,
      		sub_title : values.sub_title,
      		countrys : [values.country_1,values.country_2,values.country_3,values.country_4,values.country_5,values.country_6],
      		urls : [values.picURL_1,values.picURL_2,values.picURL_3,values.picURL_4,values.picURL_5,values.picURL_6],
      		icons : [values.icon_1,values.icon_2,values.icon_3,values.icon_4,values.icon_5,values.icon_6],
      		citys : [values.city_1,values.city_2,values.city_3,values.city_4,values.city_5,values.city_6],
      		lines : [values.line_1,values.line_2,values.line_3,values.line_4,values.line_5,values.line_6],
      		models : [values.model_1,values.model_2,values.model_3,values.model_4,values.model_5,values.model_6],
      		prices : [values.price_1,values.price_2,values.price_3,values.price_4,values.price_5,values.price_6],
      	}
      	let content = yield render('promotion_email', message)
      	this.body = content
      	//sendMail('客户留言', content, email_list)
      }
      if(this.method == 'GET') {
      	let content = {
      	   title: 'Generate Email',
      	}
      	this.body = yield render('generate_mail', content)
      }

  },

 /* Add_email_ad: function *() {
     if(this.method == 'POST') {

     } 
      if(this.method == 'GET') {

      } 
  },
*/
}

function sendMail(subject, html, email_list) {
  var mailOptions = {
    from : 'chenliangxu@ipiaoling.com',
    to: email_list,
    //to:  ['lchen@europely.com'],
    subject: subject,
    html: html
  };

  GLOBAL.smtpTransport.sendMail(mailOptions, function(error,response) {
     if (error) {
        console.log(error)
     } else {
        console.log('message has sent')
     }
     GLOBAL.smtpTransport.close()
  });
}