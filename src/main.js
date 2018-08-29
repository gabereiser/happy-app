import http         from 'http'
import session      from 'express-session'
import express      from 'express'
import bodyParser   from 'body-parser'
import cookieParser from 'cookie-parser'
import log4js       from 'log4js'

// SETUP OUR LOGGER
let log = log4js.getLogger('App main') // important to name after your module file or proto-obj
let env = process.env

log.level = (env.NODE_ENV === "production" ? 'info' : 'debug')

log.debug(`${JSON.stringify(process.env)}`)
log.info(`Starting application using ${process.env.NODE_ENV} config`)

// SETUP EXPRESS
let app = express()
app.server = http.createServer(app)

app.use(bodyParser.urlencoded({
   extended: true
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
   secret:"AllIwantToDoIShaveSomeFun!!",
   cookie: { secure: false, maxAge: (60 * 60 * 1000) }
}))
app.set('trust proxy', 1)

log.info(`Done setting up application`)


// ADD ROUTES
log.info(`Adding routes`)

app.use((req, res, next) => {
    if (req.path !== '/health_check'){
      log.debug(`${req.method} ${req.originalUrl} ${req.ip}`)
      log.info('metrics : visit')
      if(req.session.page_views){
         req.session.page_views++
         log.info(`metrics : session : ${req.sessionID} : visits : ${req.session.page_views}`)
      } else {
         req.session.page_views = 1;
         log.debug(`No page_views metric found, initializing with 1`)
      }
    }
    next()
})
app.get('/health_check', (req, res) => {

    // verify we can talk to DB and other dependencies... then spit out OK
    log.info(`HEALTH_CHECK OK`)
    res.json({"status":"ok"})
})
log.info(`Added /health_check`)

app.get('/', (req, res) => {
    log.info('MAIN_PAGE')
    res.send(`Welcome to my happy app`)
})
app.get('/api/:id?', (req, res)=> {
    log.info('API_CALL')
    res.json({"status":"ok"})
})
log.info(`Added /`)

app.get('/session', (req, res) => {
    log.info('SESSION')
    log.info('metrics : visit')
    log.info(`metrics : session : ${req.sessionID} : visits : ${req.session.page_views}`)
    log.info(`metrics : session : ${req.sessionID} : secure-zone`)
    res.send(`You've visited ${req.session.page_views} times`)
})
log.info(`Added /session`)

app.use((err, req, res, next) => {
    log.error(`An error has occured : ${err.stack}`)
    res.status(500).send('Something broke!')
})
app.use((req, res, next) => {
    log.error(`Request not found: ${req.path}`)
    res.status(404).send('Not Found')
})
log.info(`Added error handling`)

app.server.listen(env.PORT || 3000, () => {
    log.info(`Server started on ${app.server.address().port}`)
})

