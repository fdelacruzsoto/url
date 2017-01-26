var mysql = require("mysql");
var session = require('express-session');

/*
 * The entry point for this component
 */
function REST_ROUTER(router, pool, md5) {
  var self = this;
  self.handleRoutes(router, pool, md5);
}

/*
 * Here, we'll handle all the routes and its behavior for the component
 */
REST_ROUTER.prototype.handleRoutes = function(router, pool, md5) {
  
  router.use(session({secret: '1234567890SMHH'}));
  var sess;
  
  router.post('/login', function(req, res) {
    console.log('[SERVICE] - POST login ');
    
    var query = "SELECT * FROM " +
                "  user " +
                "WHERE " +
                "  mail = ? " + 
                "AND " +
                "  password = ? ";
    
    var user  = [req.body.mail, req.body.password];
    var query = mysql.format(query, user);
    
    pool.getConnection(function(err, connection){
      
      if(err) {
        console.error('[Error] - login: ' + err);
        res.statusCode = 500;
        res.json({
          "Error": true,
          "Message": "Internal server error. "
        });
        return;
      }
      
      connection.query(query, function(err, result){
        connection.release();
        if(err) {
          console.error('[Error] - login: ' + err);
          res.statusCode = 500;
          res.json({
            "Error": true,
            "Message": "DB connection error. " + err
          });
          return
        }
        console.log("Query execution successful.");
      
        _session = req.session;
        _session.token = result[0].token;
        _session.mail = result[0].mail;
        res.json({
          "Error": false,
          "Message": "OK",
          "User": result
        });
        
      });
    });
  });
  
  router.get('/logout', function (req,res) {
    req.session.destroy(function(err) {
      if(err) {
        console.error('[Error] - logout: ' + err);
      } else {
        res.json({
          "Error": false,
          "Message": "OK",
        });
      }
    });
  });
  
  router.get('/getCurrentUser', function (req,res) {
    _session = req.session;
    res.json({
      "Error": false,
      "Message": "OK",
      "UserEmail": _session.userEmail
    });
  });
  
}

module.exports = REST_ROUTER;