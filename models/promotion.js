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

  addEmailAd: function *() {
     if(this.method == 'POST') {
         let values = yield parse(this, {limit: '1kb'} )
         try {
               let result = yield GLOBAL.db.query('Insert Into email_ads Set ?', values);
               //console.log('line', result.insertId, new Date); // 
               this.redirect('/showEmailAd')
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
          let content = {
             title: 'Add Email ad',
          }
          this.body = yield render('add_email_ad', content)
      } 
  },

  showEmailAd: function *() {
    let rows = yield  GLOBAL.db.query('select * from email_ads')

          if(rows[0].length !== 0){
            var response = {
                  num_ads : rows[0].length,
                  ad_id: [],
                  countrys : [],
                  urls : [],
                  icons : [],
                  citys : [],
                  lines : [],
                  models : [],
                  prices : [],
              }
              
            rows[0].forEach(function(ad) {
              response = add_ad(ad, response)
            })
          }

           let content = {
             email_ads : response,
             title : "show email ads",
           }
          this.body = yield render('show_email_ad', content)
  },

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

function add_ad(ad, response) {
   response.urls.push(ad.url)
   response.ad_id.push(ad.ad_id)
   response.countrys.push(ad.country)
   response.icons.push(ad.icon)
   response.lines.push(ad.line)
   response.models.push(ad.model)
   response.prices.push(ad.price)
   response.citys.push(ad.city)
  return response
}