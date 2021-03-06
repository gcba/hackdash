
/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express)
  , config = require('./config.json')
  , http = require('http')
  , clientVersion = require('./client/package.json').version;

/*
 * DB
 */

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

var app = exports.app = express();

/*
 * Application config
 */

app.configure(function(){
  app.set('config', config);
  app.set('clientVersion', clientVersion);
  app.set('port', process.env.PORT || app.get('config').port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.limit('3.5mb'));
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.get('config').session));
  app.use(express.session({
      secret: app.get('config').session
    , store: new MongoStore({db: app.get('config').db.name, url:
      app.get('config').db.url}) 
    , cookie: { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/', domain: '.' + app.get('config').host }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.use(function(req, res) {
     res.status(400);
     res.render('404');
  });
  app.use(function(error, req, res, next) {
    console.log(error);
     res.status(500);
     res.render('500');
  });

  app.set('statuses',['1-winner', '1-price', '2-price', '3-price', '4-special-mention', '4-finals','5-submitted']);
  app.set('roles',['user','admin','superadmin']);
  app.set('page_contents_type',['text','faq','rules','jury','prizes', 'stages', 'submissions']);
  app.set('permissions',['edit-submit' ,'submit' ,'public-vote' ,'information', 'edit-vote']);
  app.set('dash_statuses',['close','open','coming_soon']);

	app.locals.title = config.title;
  //La siguiente linea formatea la salida HTML de JADE
  app.locals.pretty = true;
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Models
 */

require('./models')(app);

/*
 * Auth
 */

require('./auth')(app);

/*
 * Routes
 */

require('./routes')(app);

/*
 * Mailer
 */

if(app.get('config').mailer) {
	require('./mailer')(app);
}

var server = module.exports = http.Server(app);

/*
 * Live dashboard
 */

if(config.live) {
	require('./live')(app, server);
}

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

process.on('uncaughtException', function(err){
  console.log(err);
});
