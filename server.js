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
      name_line : [],
      price: [],
  }
  if (trip_info.destination == null ) return response
  switch(trip_info.days_trip) {
    case '1': 
      response = short_trip_advice(trip_info, response) 
      break
    case '2': 
      response = middle_trip_advice(trip_info, response) 
      break
    default:
       response = long_trip_advice(trip_info, response) 
     break
  }
  return response
 }
 
 function short_trip_advice(trip_info, response) {
  trip_info.destination.forEach(function(destination) {
    switch(destination) {
      case 'provence': response.num_lines += 4
      response = add_line(
        'http://europely.com/package/grand-canyon-valensole-holy-cross-lake-course/',
        '【热门推荐】瓦伦索勒薰衣草+大峡谷+圣十字湖·一日游',
        '约700元',
        response
      )
      response = add_line(
        'http://europely.com/package/classic-provencal-town-trip/',
        '【环欧推荐】薰衣草经典小镇之旅·一日游',
        '约685元',
        response
      )
      response = add_line(
        'http://europely.com/package/cherry-picking-experience/',
        '【普罗旺斯】樱桃采摘体验之旅·一日游',
        '约630元',
        response
      )
      response = add_line(
        'http://europely.com/package/van-gogh-sunflowers-route/',
        '【热门推荐】阿尔勒-向日葵之旅·一日游',
        '约630元',
        response
      )
      break
      case 'paris': response.num_lines += 1
      response = add_line(
        'http://europely.com/package/french-countryside-palace-tour/',
        '【热门推荐】法国王宫乡村一日游',
        '约630元',
        response
      )
      break
      default:
      break
    }
  })
  return response
 }


function middle_trip_advice(trip_info, response) {
  trip_info.destination.forEach(function(destination) {
    switch(destination) {
      case 'paybas': response.num_lines += 1
       response = add_line(
         'http://europely.com/package/belgium-and-netherlands-flower-weekend-3-days/',
         '【赏花路线】比利时荷兰周末赏花休闲之旅·3天2晚',
         '请询价',
         response
       )
      response.urls.push('')
      response.name_line.push('')
      break
      case 'provence': response.num_lines += 2
        response = add_line(
          'http://europely.com/package/lavender-canyoning-tour-route-2/',
          '【热门推荐】峡谷漂流探险游.2天1晚',
          '约1870元',
          response
        )
        response = add_line(
          'http://europely.com/package/lavender-canyon-depth-tour-route-2/',
          '【热门推荐】薰衣草峡谷深度游路线.2天1晚',
          '约1680元',
          response
        )
      break
      case 'paris': response.num_lines += 1
        response = add_line(
          'http://europely.com/package/french-countryside-palace-tour/',
          '【著名古迹】圣米歇尔山两日游',
          '请询价',
          response
        )
      break
      case 'tour': response.num_lines += 1
        response = add_line(
          'http://europely.com/package/chateau_tours/',
          '【环欧推荐】卢瓦尔河谷城堡梦幻游',
          '约685元',
          response
        )
      break
      default:
      break
    }
  })
  return response
}


function long_trip_advice(trip_info, response) {
  trip_info.destination.forEach(function(destination) {
    switch(destination) {
      case 'paybas':response.num_lines += 1
        response.urls.push('http://europely.com/package/visit-the-worlds-most-beautiful-spring/')
        response.name_line.push('【荷比法·探访世界上最美丽的春天10天9晚】')
        response.price.push('请询价')
      break
       case 'germany':response.num_lines += 1
        response.urls.push('http://europely.com/package/east-france-germany-switzerland-line/')
        response.name_line.push('【醉美田园】法德瑞优雅田园之品位红酒之旅.9天10')
        response.price.push('请询价')
      break
      case 'paris':response.num_lines += 1
        response.urls.push('http://europely.com/package/golden-prague-paris-opera/')
        response.name_line.push('【浪漫之路】金色布拉格+巴黎魅影·9天7晚')
        response.price.push('请询价')
      break
      case 'nice':response.num_lines += 1
        response.urls.push('http://europely.com/package/loire-valley-castles-dream-tour/')
        response.name_line.push('【经典法兰西】法国·蔚蓝海岸+奢华美食·10天7晚')
        response.price.push('请询价')
      break
      default:
      break
    }
  })
  response.num_lines += 3
  response.urls.push('http://europely.com/package/france_10days/')
  response.name_line.push('【法国深度游】 巴黎+普罗旺斯+蔚蓝海岸')
  response.price.push('请询价')
  response.urls.push('http://europely.com/package/czech-republic-austria-italy-france-ultimate-natural-and-cultural-tours/')
  response.name_line.push('【环欧精品】捷克-奥地利-意大利-法国终极自然人文之旅')
  response.price.push('请询价')
  response.urls.push('http://europely.com/package/france_25/')
  response.name_line.push('【法国深度游】环法国深度摄影旅游–高品质自由行')
  response.price.push('请询价')

  return response
}

function add_line(url_line, name_line, price, response) {
  response.urls.push(url_line)
  response.name_line.push(name_line)
  response.price.push(price)
  return response
}

app.listen(3000)