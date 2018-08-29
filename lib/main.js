'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SETUP OUR LOGGER
var log = _log4js2.default.getLogger('App main'); // important to name after your module file or proto-obj
var env = process.env;

log.level = env.NODE_ENV === "production" ? 'info' : 'debug';

log.debug('' + JSON.stringify(process.env));
log.info('Starting application using ' + process.env.NODE_ENV + ' config');

// SETUP EXPRESS
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use(_bodyParser2.default.urlencoded({
    extended: true
}));
app.use(_bodyParser2.default.json());
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
    secret: "AllIwantToDoIShaveSomeFun!!",
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }
}));
app.set('trust proxy', 1);

log.info('Done setting up application');

// ADD ROUTES
log.info('Adding routes');

app.use(function (req, res, next) {
    if (req.path !== '/health_check') {
        log.debug(req.method + ' ' + req.originalUrl + ' ' + req.ip);
        log.info('metrics : visit');
        if (req.session.page_views) {
            req.session.page_views++;
            log.info('metrics : session : ' + req.sessionID + ' : visits : ' + req.session.page_views);
        } else {
            req.session.page_views = 1;
            log.debug('No page_views metric found, initializing with 1');
        }
    }
    next();
});
app.get('/health_check', function (req, res) {

    // verify we can talk to DB and other dependencies... then spit out OK
    log.info('HEALTH_CHECK OK');
    res.json({ "status": "ok" });
});
log.info('Added /health_check');

app.get('/', function (req, res) {
    log.info('MAIN_PAGE');
    res.send('Welcome to my happy app');
});
app.get('/api/:id?', function (req, res) {
    log.info('API_CALL');
    res.json({ "status": "ok" });
});
log.info('Added /');

app.get('/session', function (req, res) {
    log.info('SESSION');
    log.info('metrics : visit');
    log.info('metrics : session : ' + req.sessionID + ' : visits : ' + req.session.page_views);
    log.info('metrics : session : ' + req.sessionID + ' : secure-zone');
    res.send('You\'ve visited ' + req.session.page_views + ' times');
});
log.info('Added /session');

app.use(function (err, req, res, next) {
    log.error('An error has occured : ' + err.stack);
    res.status(500).send('Something broke!');
});
app.use(function (req, res, next) {
    log.error('Request not found: ' + req.path);
    res.status(404).send('Not Found');
});
log.info('Added error handling');

app.server.listen(env.PORT || 3000, function () {
    log.info('Server started on ' + app.server.address().port);
});