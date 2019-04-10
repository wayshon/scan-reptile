const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')

const tasks = require('./task/tasks')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views('views',{map:{html:'ejs'}}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())

// tasks.gameTask();
// tasks.wallpaperTask();
// tasks.foodTask();
// tasks.plantTask();
tasks.girlTask();

// tasks.scheduleGameTask();
// tasks.scheduleWallpaperTask();
// tasks.scheduleFoodTask()
// tasks.schedulePlantTask()

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


// const test = require('./test')
// test();



module.exports = app
