var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function(app) {

  var User = new Schema({
      "provider": { type: String, required: true }
    , "provider_id": { type: String, required: true }
    , "username": { type: String, required: true }
    , "name": { type: String, required: true }
    , "email": { type: String, validate: /.+@.+\..+/ }
    , "picture": String
    , "admin_in": { type: [String], default: [] }
    , "bio": String
    , "baid": String
    , "created_at": {type: Date, default: Date.now }
    , "role": { type: String, enum: app.get('roles'), default: app.get('roles')[0] }
  });
  mongoose.model('User', User);

  var Project = new Schema({
      "title": { type: String }
    , "challenge_id": { type: ObjectId, required: true, ref: 'Dashboard' }
    , "description": { type: String }
    , "leader": { type: ObjectId, required: true, ref: 'User' }
    , "status": { type: String, enum: app.get('statuses'), default: '5-submitted' }
    , "contributors": [{ type: ObjectId, ref: 'User'}]
    , "followers": [{ type: ObjectId, ref: 'User'}]
    , "cover": String
    , "link": String
    , "tags": [String]
    , "imageurl": String
    , "videourl": String
    , "videourl": String
    , "text": String
    , "fileurl": String
    , "result": String
    , "active": { type: Boolean, default: true }
    , "created_at": { type: Date, default: Date.now }
  });
  mongoose.model('Project', Project);

  console.log(app.get('dash_statuses'));
  var Dashboard = new Schema({
      "slug": { type: String, index: { unique: true } }
    , "title": { type: String }
    , "subtitle": { type: String }
    , "description": { type: String }
    , "dash_status": { type: String, enum: app.get('dash_statuses'), default: app.get('dash_statuses')[0] }
    , "open": { type: Boolean, default: false }
    , "showcase": [String]
    , "type": [String]
    , "status": [String]
    , "created_at": { type: Date, default: Date.now }
    , "header_images" : [String]
    , "allow_comments": Boolean
    , "pages" : [{
        "title": { type: String, required: true }
      , "text": { type: String}
      , "content_type": { type: String, enum: app.get('page_contents_type'), default: app.get('page_contents_type')[0] }
      , "active": {type: Boolean}
      , "weight": {type: Number}
    }]
    , "contact": { type: String, validate: /.+@.+\..+/ }
    , "submit_fields":  [{
        "type": { type: String, required: true }
      , "label": { type: String, required: true }
      , "help": { type: String, required: true }
      , "order": { type: String, required: true }
      , "important": { type: Boolean, default: false }
    }]
    , "categories": [String]
    , "stages": [{
        "name": { type: String, required: true }
      , "start": { type: Date, required: true }
      , "end": { type: Date, required: true }
      , "permissions": [ { type: String, enum: app.get('permissions') } ]
    }]
    , "call_to_action": {
        "label": { type: String, default: "Participar" }
      , "help": { type: String, default: "" }
      ,"color": { type: String}
      ,"bgcolor": { type: String}
    }
    , "link_color": {type: String}
  });
  mongoose.model('Dashboard', Dashboard);

  var Collection = new Schema({
      "owner": { type: ObjectId, required: true, ref: 'User' }
    , "title": String
    , "description": String
    , "dashboards": [{ type: ObjectId, ref: 'Dashboard' }]
    , "created_at": { type: Date, default: Date.now }
  });
  mongoose.model('Collection', Collection);
  
};
