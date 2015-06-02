var koa = require('koa')
var views = require('co-views')
var parse = require('co-body')
var router = require('koa-router')();
var app = koa()

var render = views(__dirname +  '/views', {
  ext: 'ejs'
})

//===========router setting==============
router
  .get('/', index())
  .post('/show_trip', show_trip())
  .get('/destination', destination())

function index() {
  return  function* (next) {
    content = {title: '行程定制'}
    this.body  = yield render('book', content)
  }
}

function show_trip() {
  return function* (next) {
    if(this.method !== 'POST') return yield next
      var body = yield parse(this, {limit: '1kb'} )
      content = {
        advices : advice(body),
        title : "路线推荐",
      }
     this.body = yield render('show_trip', content)
   }
}

function destination() {
  return function* (next) {
    content = {title: '行程咨询表单'}
    this.body  = yield render('destination', content)
  }
}

//========app setting===============
app
  .use(router.routes())
  .use(function *notFound(next) {
    if (this.status == 404) {
      content = {title : '页面不存在'}
      this.body = yield render('no_found', content)
    } else {
      yield next
    }
  })
/*
app.use()

app.use()

app.use(function* no_found(next) {
 
})
*/

//============all the functions===========
function advice(trip_info) {
  response = {
      num_lines : 0,
      urls : [],
  }
  switch(trip_info.days_trip) {
    case '1': response.num_lines = 1
      response.urls.push('http://europely.com/package/grand-canyon-valensole-holy-cross-lake-course/')
      break
    case '2': response.num_lines = 2
      response.urls.push('http://europely.com/package/lavender-canyoning-tour-route-2/')
      response.urls.push('http://europely.com/package/lavender-canyon-depth-tour-route-2/')
      break
    default:
      response.num_lines = 0
      response.urls.push('http://europely.com/')
     break
  }
  return response
 }
  /*
  if (trip_info.days_trip > 10) {
    if (trip_info.destinations == 'france_around') {
     return {
      num_lines : 1,
      urls : {
        'first': 'http://europely.com/package/czech-republic-austria-italy-france-ultimate-natural-and-cultural-tours/'
      },
    }
    }
  }
  return {
      num_lines : 0,
      urls : {
        'first' : 'http://europely.com/'
      },
    }
}
*/
app.listen(3000)