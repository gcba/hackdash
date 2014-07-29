/*
 * RESTfull API: Dashboard Resources
 * 
 * 
 */


var passport = require('passport')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , config = require('../../../config.json');

var Project = mongoose.model('Project')
  , User = mongoose.model('User')
  , Dashboard = mongoose.model('Dashboard');

module.exports = function(app, uri, common) {

  //LIST
  app.get(uri + '/dashboards', setQuery, setDashboards, sendDashboards);
  
  //NEW
  app.post(uri + '/dashboards', common.isAuth, validateSubdomain, createDashboard(app), sendDashboard);

  //GET ONE
  app.get(uri + '/dashboards/:did', getDashboard, sendDashboard);

  //UPDATE
  app.put(uri + '/dashboards/:did', common.isAuth, getDashboard, common.isAdminDashboard, updateDashboard, sendDashboard);

  //GET MY dashboards
  app.get(uri + '/admin_dashboards', common.isAuth, setMyDashboards, sendDashboards);
  app.del(uri + '/admin_dashboards/:did', common.isAuth, common.isAdminDashboard, getDashboard, removeDashboard);

/*app.get(uri + '/', getDashboard, sendDashboard);
  app.post(uri + '/', common.notAllowed);
  app.del(uri + '/', common.notAllowed);*/

  app.get(uri + '/csv', common.isAuth, getDashboard, common.isAdminDashboard, sendDashboardCSV);
};

var validateSubdomain = function(req, res, next) {
  
  if(!/^[a-z0-9]{5,10}$/.test(req.body.slug)) {
    return res.json(400, { error: "subdomain_invalid" });
  }

  next();
};

var createDashboard =  function(app){
  return function(req, res, next) {

    Dashboard.findOne({slug: req.body.slug}, function(err, dashboard){
      if(err || dashboard) {
        return res.json(409, { error: "slug_inuse" });
      }

      var dash = new Dashboard({ slug: req.body.slug});
      dash.save(function(err){
        User.findById(req.user.id, function(err, user) {
          user.admin_in.push(dash._id);
          user.save(function(){
            req.dashboard = dash;
            next();
          });
        });

      });
    });
  };
};

var setQuery = function(req, res, next){
  var query = req.query.q || "";

  req.search_query = {};

  if (query.length === 0){
    return next();
  }

  var regex = new RegExp(query, 'i');
  req.search_query.$or = [ { slug: regex }, { title: regex }, { description: regex } ];

  next();
};

var setDashboards = function(req, res, next){
  Dashboard.find(req.search_query || {})
    .limit(30)
    .sort( { "created_at" : -1 } )
    .exec(function(err, dashboards) {
      if(err) return res.send(500);
      req.dashboards = dashboards || [];
      next();
    });
}


var setMyDashboards = function(req, res, next){
  Dashboard.find( { _id : { $in : req.user.admin_in } })
    .sort( { "created_at" : -1 } )
    .exec(function(err, dashboards) {
      if(err) return res.send(500);
      req.dashboards = dashboards || [];
      next();
    });
}

var getDashboard = function(req, res, next){
    Dashboard.findById(req.params.did)
      .exec(function(err, dashboard) {
        if(err) return res.send(500);
        if(!dashboard) return res.send(404);
        req.dashboard = dashboard;
        next();
      });
}

var updateDashboard = function(req, res, next) {
  var dashboard = req.dashboard;

  if(req.body.link && req.body.link.indexOf('http') != 0) {
    req.body.link = 'http://' + req.body.link;
  }

  function getValue(prop){
    return req.body.hasOwnProperty(prop) ? req.body[prop] : dashboard[prop];    
  }

  dashboard.title = getValue("title");
  dashboard.subtitle = getValue("subtitle");
  dashboard.description = getValue("description");
  dashboard.link = getValue("link");
  dashboard.open = getValue("open");
  dashboard.contact = getValue("contact");
  dashboard.pages = getValue("pages");
  dashboard.stages = getValue("stages");
  dashboard.categories = getValue("categories");
  dashboard.submit_fields = getValue("submit_fields");
  dashboard.header_images = getValue("header_images");
  dashboard.link_color = getValue("link_color");
  dashboard.call_to_action = getValue("call_to_action");
  dashboard.allow_comments = getValue("allow_comments");
  dashboard.save(function(err, dashboard){

    if(err) return res.send(500);
    req.dashboard = dashboard;
    next();
  });
};

var sendDashboard = function(req, res){
  res.send(req.dashboard);
};

var sendDashboards = function(req, res){
  res.send(req.dashboards);
};

var sendDashboardCSV = function(req, res){
  var domain = req.subdomains[0];

  function CSVEscape(field) {
    return String(field || "").replace(/\"/g, '""').replace(/,/g, '');
  }
  
  var headers = [
      'name'
    , 'username'
    , 'provider'
    , 'e-mail'
    , 'engagement'
    , 'project'
    , 'status'
    , 'dashboard'
  ].map(CSVEscape).join(',');
 
  function projectToCSV(project) {

    var people = [];

    function addPerson(engagement, user){
      people.push([
          user.name
        , user.username
        , user.provider
        , user.email
        , engagement
        , project.title
        , project.status
        , domain
      ]);
    }

    _.each(project.contributors, addPerson.bind(null, "contributor"));
    _.each(project.followers, addPerson.bind(null, "follower"));

    // sort people by name ASC
    people.sort(function(a, b) { return a[0] - b[0]; });

    return (_.map(people, function(person){
      return person.map(CSVEscape).join(',') + '\n';
    })).join("");
  }
 
  var started = false;
  function start(response) {
    response.setHeader('Content-disposition', 'attachment; filename=' + domain + '.csv');
    response.contentType('csv');
    response.write(headers + '\n');
    started = true;
  }
 
  Project.find({ domain: domain })
    .populate('contributors')
    .populate('followers')
    .sort('title')
    .stream()
    .on('data', function (project) {
      if (!started) { start(res); }
      res.write(projectToCSV(project));
    })
    .on('close', function () {
      res.end();
    })
    .on('error', function (err) {
      res.send(500, {err: err, msg: "Failed to get projects"});
    });

};

var removeDashboard = function(req, res){
  req.dashboard.remove(function (err){
    if (err) return res.send(500, "An error ocurred when removing this project");
    res.send(204); //all good, no content
  });
};