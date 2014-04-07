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
      "domain": String
    , "title": String
    , "description": String
    , "link": String
    , "open": { type: Boolean, default: true }
    , "showcase": [String]
    , "type": [String]
    , "status": [String]
    , "parent": [String]
    , "created_at": { type: Date, default: Date.now }
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
