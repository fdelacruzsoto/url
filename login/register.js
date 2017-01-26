var mysql = require("mysql");
var jwt   = require("jsonwebtoken");

/*
 * The entry point for this component
 */
function REST_ROUTER(router, pool, md5) {
  var self = this;
  self.handleRoutes(router, pool, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, pool, md5) {
  
  router.post('/register', function(req, res) {
    console.log('[SERVICE] - POST register');
    var JWT_SECRET = '1234567890SMHH';
    var token  = jwt.sign({user: req.body.email}, JWT_SECRET);
    
    var query   = 'INSERT INTO '  + 
                '   user '        +
                '(mail, '         +
                'password, '      +
                'token) '         +  
                'VALUES '         + 
                '(?, ?, ?)'; 
    
    var params  = [req.body.mail, req.body.password, token];
    var query   = mysql.format(query, params);
    
    pool.getConnection(function(err, connection){
      
      if(err) {
        console.error('[Error] - register: ' + err);
        res.statusCode = 500;
        res.json({
          "Error": true,
          "Message": "Internal server error."
        });
        return;
      }
      
      connection.query(query, function(err, result){
        connection.release();
        if(err) {
          console.error('[Error] - register: ' + err);
          res.statusCode = 500;
          res.json({
            "Error": true,
            "Message": "Internal server error."
          });
          return
        }
        console.log("Query execution successful.");
        res.json({
          "Error": false,
          "Message": "OK",
          "Results": result
        });
      });
      
    });
    
  });
  
}

module.exports = REST_ROUTER;