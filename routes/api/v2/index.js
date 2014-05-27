
/*
 * RESTfull API
 * 
 * 
 */


var passport = require('passport')
  , mongoose = require('mongoose')
  , config = require('../../../config.json');

module.exports = function(app) {

  var root = '/api/';

  require('./dashboard')(app, root + 'v2', common);
  require('./collections')(app, root + 'v2', common);
  require('./projects')(app, root + 'v2', common);
  require('./users')(app, root + 'v2', common);

};

var common = {
  
  notAllowed: function(req, res){
    res.send(405); //Not Allowd
  },

  isAuth: function(req, res, next){
    if (!req.isAuthenticated()){
      return res.send(401, "User not authenticated");
    }

    next();
  },

  isSuperAdmin: function(req, res, next){
    if(req.user.role!='superadmin'){
      return res.send(403, "Not enough roles");
    }

    next();
  }


};
