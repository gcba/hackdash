/*
 * RESTfull API: Users Resources
 * 
 * 
 */


var passport = require('passport')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , config = require('../../../config.json');

var User = mongoose.model('User')
  , Project = mongoose.model('Project')
  , Collection = mongoose.model('Collection');

module.exports = function(app, uri, common) {

  //GET ALL admin users from one dashboard  
  app.get(uri + '/dashboards/:did/admins', getInstanceAdmins, sendUsers);

  //app.get(uri + '/admins', getInstanceAdmins, sendUsers);
  app.get(uri + '/users/:uid', getUser, sendUser);
  app.get(uri + '/users', common.isAuth, getUsers, sendUsers);

  app.get(uri + '/profiles/:uid', getUser, setCollections, setProjects, setContributions, setLikes, sendUser);
  app.put(uri + '/profiles/:uid', common.isAuth, getUser, canUpdate, updateUser);

};

var getInstanceAdmins = function(req, res, next){
  User
    .find({ "admin_in": req.params.did })
    .exec(function(err, users) {
      if(err) return res.send(500);
      req.users = users || [];
      next();
    });
};

var getUsers = function(req, res, next){

  User
    .find()
    .exec(function(err, users) {
      if(err) return res.send(500);
      req.users = users || [];
      next();
    });
};

var getUser = function(req, res, next){
  User
    .findById(req.params.uid, function(err, user){
      if(err) return res.send(500);
      req.user_profile = user.toObject();
      next();
    });
};

var canUpdate = function(req, res, next){
  var isLogedInUser = req.user.id === req.params.uid;
  
  if (!isLogedInUser) {
    return res.send(403, "Only your own profile can be updated.");
  }

  next();
};

var updateUser = function(req, res){
  var user = req.user;
  
  //add trim

  if (!req.body.name){
    return res.send(500, { error: "name_required" });
  }

  if (!req.body.email){
    return res.send(500, { error: "email_required" });
  }

  user.name = req.body.name;
  user.email = req.body.email;
  user.bio = req.body.bio;

  user.save(function(err, user){
    if(err) {
      if (err.errors.hasOwnProperty('email')){
        return res.send(500, { error: "email_invalid" });
      }

      return res.send(500);
    }
    
    res.send(200);
  });
};

var setCollections = function(req, res, next){

  Collection
    .find({ "owner": req.user_profile._id }, function(err, collections) {
      if(err) return res.send(500);
      req.user_profile.collections = collections || [];
      next();
    });
};

var setProjects = function(req, res, next){

  Project
    .find({ "leader": req.user_profile._id }, function(err, projects) {
      if(err) return res.send(500);
      req.user_profile.projects = projects || [];
      next();
    });
};

var setContributions = function(req, res, next){
  var uid = req.user_profile._id;

  Project
    .find({ "leader": { $ne: uid } , "contributors": uid }, function(err, projects) {
      if(err) return res.send(500);
      req.user_profile.contributions = projects || [];
      next();
    });

};

var setLikes = function(req, res, next){
  var uid = req.user_profile._id;

  Project
    .find({ "leader": { $ne: uid }, "followers": uid }, function(err, projects) {
      if(err) return res.send(500);
      req.user_profile.likes = projects || [];
      next();
    });
    
};

var sendUser = function(req, res){
  res.send(req.user_profile);
};

var sendUsers = function(req, res){
  res.send(req.users);
};
