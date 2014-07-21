/*
 * RESTfull API: Project Resources
 * 
 * 
 */

var passport = require('passport')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , fs = require('fs')
  , config = require('../../../config.json');

var Project = mongoose.model('Project')
  , Dashboard = mongoose.model('Dashboard');

var notify;

module.exports = function(app, uri, common) {

  notify = function(type, req) {
    app.emit('post', {
      type: type, 
      project: req.project, 
      user: req.user,
      domain: req.project.domain
    });
  };
  
  var loadCommon = function(common){
    return function(req, res, next){
      res.locals.common = common;
      next();
    }
  };
  //GET SCHEMA
  app.get(uri + '/projects/schema', common.isAuth, setSchema, sendSchema);

  //LIST
  app.get(uri + '/projects', setQuery, setProjects, sendProjects);

  //NEW
  app.post(uri + '/projects', common.isAuth, loadCommon(common), canCreateProject, createProject, sendProject);
  app.post(uri + '/projects/cover', common.isAuth, uploadCover);

  //GET ONE  
  app.get(uri + '/projects/:pid', getProject, sendProject);

  //GET ALL from one dashboard
  app.get(uri + '/dashboards/:did/projects', setQuery, setProjects, sendProjects);
  app.get(uri + '/admin_dashboards/:did/projects', common.isAuth, common.isAdminDashboard, ignoreActive, setQuery, setProjects, sendProjects);

  //PUT SAVE SUMBIT FROM PROJECT
  app.put(uri + '/dashboards/:did/projects/:pid', common.isAuth, getProject, canChangeProject, updateProject, sendProject);
  app.put(uri + '/admin_dashboards/:did/projects/:pid', common.isAuth, common.isAdminDashboard, getProject, canChangeProject, updateProject, sendProject);

  //app.del(uri + '/projects/:pid', common.isAuth, common.isAdminDashboard, getProject, canChangeProject, removeProject);
  
  app.post(uri + '/projects/:pid/followers', common.isAuth, getProject, loadCommon(common), validate, addFollower);
  //app.del(uri + '/projects/:pid/followers', common.isAuth, getProject, validate, removeFollower);

  //app.post(uri + '/projects/:pid/contributors', common.isAuth, getProject, validate, addContributor);
  //app.del(uri + '/projects/:pid/contributors', common.isAuth, getProject, validate, removeContributor);

};

var setSchema = function(req, res, next){
  var options=[],
      ignore = ['_id','__v','created_at','active','followers','domain','leader','status','contributors','followers','result','challenge_id','tags'];
  for (var prop in Project.schema.paths) {
      if (Project.schema.paths.hasOwnProperty(prop) && ignore.indexOf(prop)==-1) {
          options.push(prop);
      }
  }
  req.schema = options;
  next();
};

var sendSchema = function(req, res, next){
  res.send(req.schema);
};

var getProject = function(req, res, next){
  Project.findById(req.params.pid)
    .populate({
      path: 'leader',
      select: 'name picture _id'
    })
    .populate({
      path: 'contributors',
      select: 'name picture _id'
    })
    .populate({
      path: 'followers',
      select: 'name picture _id'
    })
    .exec(function(err, project) {

      if (err) return res.send(500);
      if (!project) return res.send(404);

      req.project = project;
      next();
  });
};

var canChangeProject = function(req, res, next){

  //var isLeader = req.user.id === req.project.leader.id;
  var isAdmin = (req.project.challenge_id && req.user.admin_in.indexOf(req.project.challenge_id) >= 0);

  if (!isAdmin) {
    return res.send(403, "Only Leader or Administrators can edit or remove this project.");
  }

  next();
};

// TODO: get dashboard from dashboards controllers 
var canCreateProject = function(req, res, next){

  Dashboard.findOne({ _id: req.body.challenge_id })
    .exec(function(err, dashboard) {
      if(err) return res.send(500);
      if(!dashboard) return res.send(404);
      
      if (!dashboard.open || !res.locals.common.isAbleTo('submit',dashboard) ) 
        return res.send(403, "Dashboard is closed for creating projects");

      next();
    });

};

var createProject = function(req, res, next){

  if(req.body.link && req.body.link.indexOf('http') != 0) {
    req.body.link = 'http://' + req.body.link;
  }

  var tags = req.body.tags || [];
  if (!Array.isArray(tags)){
    tags = tags.toString().split(',');
  }

  var project = new Project({
      title: req.body.title
    , description: req.body.description
    , link: req.body.link
    , status: req.body.status
    , tags: tags
    , created_at: Date.now()
    , leader: req.user._id
    , followers: [req.user._id]
    , contributors: [req.user._id]
    , cover: req.body.cover
    , challenge_id: mongoose.Types.ObjectId(req.body.challenge_id)
    , imageurl: req.body.imageurl
    , videourl: req.body.videourl
    , fileurl: req.body.fileurl
    , text: req.body.text
    , file: req.body.file
  });

  /*if (!project.title){
    return res.json(500, { error: "title_required" });
  }

  if (!project.description){
    return res.json(500, { error: "description_required" });
  }*/

  project.save(function(err, project){
    if(err) return res.send(500); 
    req.project = project;

    notify('project_created', req);

    next();
  });

};

var uploadCover = function(req, res, next) {
  console.log('SUBIENDO');
  var cover = (req.files && req.files.cover && req.files.cover.type.indexOf('image/') != -1 
    && '/uploads/' + req.files.cover.path.split('/').pop() + '.' + req.files.cover.name.split('.').pop());

  if(req.files && req.files.cover && req.files.cover.type.indexOf('image/') != -1) {
    var tmp_path = req.files.cover.path
      , target_path = './public' + cover;

    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      fs.unlink(tmp_path, function() {
        if (err) throw err;
        res.json({ href: cover });
      });
    });
  }
};

var updateProject = function(req, res, next) {
  var project = req.project;

  function getValue(prop){
    return req.body.hasOwnProperty(prop) ? req.body[prop] : project[prop];    
  }

  var link = getValue("link");
  if(link && link.indexOf('http') != 0) {
    link = 'http://' + link;
  }

  var tags = getValue("tags");
  if (!Array.isArray(tags)){
    tags = tags.toString().split(',');
  }

  project.title = getValue("title");
  project.description = getValue("description");
  project.link = link;
  project.status = getValue("status");
  project.cover = getValue("cover");
  project.tags = tags;
  project.imageurl = getValue("imageurl");
  project.videourl = getValue("videourl");
  project.fileurl = getValue("fileurl");
  project.text = getValue("text");
  project.file = getValue("file");

  //add trim

 /* if (!project.title){
    return res.json(500, { error: "title_required" });
  }

  if (!project.description){
    return res.json(500, { error: "description_required" });
  }
*/
  var isAdmin = (req.project.challenge_id && req.user.admin_in.indexOf(req.project.challenge_id) >= 0);
  if (isAdmin){ 
    //only update active state if is the dashboard admin
    project.active = getValue("active");
  }
  
  project.save(function(err, project){
    if(err) return res.send(500);
    req.project = project;

    notify('project_edited', req);

    next();
  });
};

var removeProject = function(req, res){
  req.project.remove(function (err){
    if (err) return res.send(500, "An error ocurred when removing this project");
    res.send(204); //all good, no content
  });
};

// TODO: change this validations for external API access.
var validate = function(req, res, next){
  var user = req.user;
  var project = req.project;

  Dashboard.findOne({ _id: req.project.challenge_id })
    .exec(function(err, dashboard) {
      if(err) return res.send(500);
      if(!dashboard) return res.send(404);
      
      if (user._id === project.leader.id ){
        return res.send(406, "Leader of the project cannot leave or unfollow.");
      }

      if( !res.locals.common.isAbleTo('public-vote',dashboard) ){
        return res.send(406, "Not available.");
      }

      next();

    });

};

var addFollower = function(req, res, next){
  var projectId = req.params.pid;
  var userId = req.user.id;

  Project.findByIdAndUpdate(projectId, { $addToSet : { 'followers': userId }})
    .populate({
      path: 'followers',
      select: 'name picture _id'
    })
    .exec(function(err, data){
      if(err) return res.send(500);

      notify('project_follow', req);
      res.send(data);
    });

};

var removeFollower = function(req, res){
  var projectId = req.params.pid;
  var userId = req.user.id;

  Project.update({_id: projectId}, { $pull : { 'followers': userId }}, function(err){
    if(err) return res.send(500);
    
    notify('project_unfollow', req);
    res.send(200);
  });
};

var addContributor = function(req, res){
  var projectId = req.params.pid;
  var userId = req.user.id;

  Project.update({_id: projectId}, { $addToSet : { 'contributors': userId }}, function(err){
    if(err) return res.send(500);
    
    notify('project_join', req);
    res.send(200);
  });

};

var removeContributor = function(req, res){
  var projectId = req.params.pid;
  var userId = req.user.id;

  Project.update({_id: projectId}, { $pull : { 'contributors': userId }}, function(err){
    if(err) return res.send(500);
    
    notify('project_leave', req);
    res.send(200);
  });

};

var ignoreActive = function(req, res, next){
  req.ignoreActive = true;
  next();
};

var setQuery = function(req, res, next){
  var cat = req.query.cat || "";
  var order = req.query.order || "";

  req.query = {};
  req.orderBy = {};

  if (req.params.did) {
    var ignoreActive = req.ignoreActive || false;
    if(ignoreActive){
      req.query = { challenge_id: req.params.did};
    } else {
      req.query = { challenge_id: req.params.did, active: true };      
    }
  }

  if (cat.length === 0 && order.length === 0){
    return next();
  } else {
    if(cat!=""){
      req.query['tags'] = cat;
    }
    if(order!=""){
      req.orderBy[order] = 1;
    }
  }

 /* var regex = new RegExp(query, 'i');
  req.query.$or = [ { title: regex }, { description: regex } ];*/

  next();
};

var setProjects = function(req, res, next){
  req.orderBy = req.orderBy || { "created_at" : -1 }; 

  Project.find(req.query || {})
    .populate({
      path: 'leader',
      select: 'name picture _id'
    })
    .populate({
      path: 'contributors',
      select: 'name picture _id'
    })
    .populate({
      path: 'followers',
      select: 'name picture _id'
    })
    .limit(30)
    .sort( req.orderBy )
    .exec(function(err, projects) {
      if(err) return res.send(500);
      req.projects = projects;
      next();
    });
}

var sendProject = function(req, res){
  res.send(req.project);
};

var sendProjects = function(req, res){
  res.send(req.projects);
};
