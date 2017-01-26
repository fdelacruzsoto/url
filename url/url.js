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
  
  router.post('/create', function(req, res) {
    console.log('[SERVICE] - create url. ');
    var url = req.body.url;
    var ts = new Date().getTime();
    var JWT_SECRET = Math.random().toString(36).substr(0, 10);
    var randomString = Math.random().toString(36).substr(0, 10);
    var token  = jwt.sign({random: randomString, timestamp: Math.floor(Date.now() / 1000) - 30}, JWT_SECRET);
    var urlShortened = token.slice(124,132);
    
    var query   = 'INSERT INTO '    + 
                '   url '           +
                '(original_url, '   +
                'short_url) '       +  
                'VALUES '           + 
                '(?, ?)'; 
                
    var params  = [url, urlShortened];
    var query   = mysql.format(query, params);
    
    pool.getConnection(function(err, connection){
      
      if(err) {
        console.error('[Error] - url: ' + err);
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
          console.error('[Error] - url: ' + err);
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
  
  router.get('/r/:url', function(req, res) {
    console.log('[SERVICE] - Redirect. ');
    var url = req.params.url;
    var query   = 'SELECT '           +
                  '   original_url '  + 
                  'FROM '             +
                  '   url '           +
                  'WHERE '            +
                  '   short_url = ? ';
    
    var params  = [url];
    var query   = mysql.format(query, params);
    
    pool.getConnection(function(err, connection){
      
      if(err) {
        console.error('[Error] - redirect: ' + err);
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
          console.error('[Error] - redirect: ' + err);
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
  
  router.get('/list', function(req, res) {
    console.log('[SERVICE] - List. ');
    var query   = 'SELECT * FROM url';     

    query   = mysql.format(query);
    console.log("Query :" + query);
    
    pool.getConnection(function(err, connection){
      
      if(err) {
        console.error('[Error] - list: ' + err);
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
          console.error('[Error] - list: ' + err);
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

module.exports = REST_ROUTER