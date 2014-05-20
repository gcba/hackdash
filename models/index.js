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
      "title": { type: String, required: true }
    , "domain": String
    , "description": { type: String, required: true }
    , "leader": { type: ObjectId, required: true, ref: 'User' }
    , "status": { type: String, enum: app.get('statuses'), default: app.get('statuses')[0] }
    , "contributors": [{ type: ObjectId, ref: 'User'}]
    , "followers": [{ type: ObjectId, ref: 'User'}]
    , "cover": String
    , "link": String
    , "tags": [String]
    , "imageurl": String
    , "videourl": String
    , "text": String
    , "fileurl": String
    , "result": String
    , "status": [String]
    , "active": { type: Boolean, default: true }
    , "created_at": { type: Date, default: Date.now }
  });
  mongoose.model('Project', Project);

  var Dashboard = new Schema({
      "domain": { type: String, required: true, index: { unique: true } }
    , "title": { type: String, required: true }
    , "description": { type: String, required: true }
    , "open": { type: Boolean, default: true }
    , "showcase": [String]
    , "type": [String]
    , "status": [String]
    , "created_at": { type: Date, default: Date.now }
    , "header_images" : [String]
    , "pages" : [{ type: ObjectId, ref: 'Page'}]
    , "contact": String
    , "submit_fields": [String]
    , "categories": [String]
    , "stages": [{ type: ObjectId, ref: 'Stage'}]
  });
  mongoose.model('Dashboard', Dashboard);

  var Page = new Schema({
      "title": { type: String, required: true }
    , "text": { type: String, required: true }
    , "content_type": { type: String, enum: app.get('page_contents_type'), default: app.get('page_contents_type')[0] }
  });
  mongoose.model('Page', Page);

  var Stage = new Schema({
      "name": { type: String, required: true }
    , "start": { type: Date, required: true }
    , "end": { type: Date, required: true }
    , "permissions": [ { type: String, enum: app.get('permissions') } ]
  });
  mongoose.model('Stage', Stage);

  var Collection = new Schema({
      "owner": { type: ObjectId, required: true, ref: 'User' }
    , "title": String
    , "description": String
    , "dashboards": [{ type: ObjectId, ref: 'Dashboard' }]
    , "created_at": { type: Date, default: Date.now }
  });
  mongoose.model('Collection', Collection);
  
    var Pages = new Schema({
      "owner": { type: ObjectId, required: true, ref: 'User' }
    , "domain": String
    , "type": String
    , "title": String
    , "description": String
    , "descriptionbig": String
    , "status": String
    , "imageurl": String
    , "dashboards": [{ type: ObjectId, ref: 'Dashboard' }]
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('Pages', Pages);
};
