// Global configurations
var config      = require('./config/config');
var port        = process.env.PORT || 3000;
var dev         = process.env.DEV;

// Npm modules
var express     = require('express');
var mysql       = require('mysql');
var bodyParser  = require('body-parser');
var md5         = require('MD5');
var app         = express();
var morgan      = require('morgan');

// App components
var login       = require('./login/login.js');
var register    = require('./login/register.js');
var url         = require('./url/url.js');

/*
 * App entry point
 */
function REST() {
  var self = this;
  self.connectMysql();
};

/*
 * Handle mysql connection pool
 */
REST.prototype.connectMysql = function() {
  var self = this;
  var pool = mysql.createPool({
    host:     config.db.host,
    port:     config.db.port,
    user:     config.db.user,
    password: config.db.password,
    database: config.db.database
  });
  self.configureExpress(pool);
}

/*
 * Set up all routers for web services and configure cors
 * Each one of the router will receive the mysql connection pool and the md5 objects
 */
REST.prototype.configureExpress = function(pool) {
  var self = this;
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  var router = express.Router();
  router.use(function(req, res, next) {
    console.log('There was a call on the API.');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });
  app.use('/api', router);
  app.use(morgan("dev"));
  app.use(express.static("./static"));
  var login_router    = new login(router, pool, md5);
  var register_router = new register(router, pool, md5);
  var url_router      = new url(router, pool, md5);
  self.startServer();
}

/*
 * The server will be listening on the configured port
 */
REST.prototype.startServer = function() {
  app.listen(port, function() {
    console.log("All right ! I am alive at Port " + port + ".");
  });
}

/*
 * If there is any errot while starting the server, this function will log it
 */
REST.prototype.stop = function(err) {
  console.log("There was an error: \n" + err);
  process.exit(1);
}

// Create a new instance of the app
new REST();

//Export app for unit testing
module.exports = app;