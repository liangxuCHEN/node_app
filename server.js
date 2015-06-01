var koa = require('koa')
var views = require('co-views')
var parse = require('co-body');
var app = koa()

var render = views(__dirname +  '/views', {
  ext: 'ejs'
})

app.use(function* index(next) {
  if(this.request.path !== '/') return yield next
  content = {title: 'home page'}
  this.body  = yield render('index')
})

app.use(function* show_trip(next){
  if(this.request.path !== '/show_trip') return yield next
  if(this.method !== 'POST') return yield next
  var body = yield parse(this, {limit: '1kb'} )
  content = {
    advices : advice(body),
    title : "Our advice",
}
  this.body = yield render('show_trip', content)
})

app.use(function* no_found(next) {
 content = {title : 'Page not found'}
 this.body = yield render('no_found', content)
})

function advice(trip_info) {
  if (trip_info.days_trip > 25) {
    return {
      num_lines : 0,
      urls : {
        'first': 'http://europely.com/reservation/'
      },
    }
  }
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

app.listen(3000)