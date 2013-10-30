
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongojs = require('mongojs')
  , MongoStore = require('connect-mongo')(express);

var app = express(), db;

app.configure(function () {
  db = mongojs(process.env.MONGOLAB_URI || 'olumni', ['courses','mySessions','groups','posts']);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('secret', process.env.SESSION_SECRET || 'terrible, terrible secret')
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.get('secret')));
  app.use(express.session({
    secret: app.get('secret'),
    store: new MongoStore({
      url: process.env.MONGOLAB_URI || 'mongodb://localhost/weachieve'
    })
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.set('host', 'localhost:3000');
  app.use(express.errorHandler());
});

app.configure('production', function () {
  app.set('host', 'weachieveserver.herokuapp.com');
});

/**
 * Helpful
 */

function validateShort (name) {
  return String(name).substr(0, 25);
}

function validateLong (tweet) {
  return String(tweet).substr(0, 140);
}

function validateUsername (name) {
  return String(name).substr(0, 25);
}

function validateTweet (tweet) {
  return String(tweet).substr(0, 140);
}

/**
 * Routes
 */

app.get('/', function (req, res) {
  res.redirect('https://github.com/MaciCrowell/olumni-server');
})

app.get('/secret', function (req, res) {
  db.groups.find({
    published: true
  }).sort({date: -1}, function (err, docs) {
    console.log(docs);
    res.render('index', {
      title: 'Olumni',
      quotes: docs,
      user: {}
    });
  })
});

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

/**
 * get all groups
 */

app.get('/groups', function (req, res) {
  db.groups.distinct('group', function (err, names) {
    res.json({"groups": names});
  });
})

/**
 * get groups user is in 
 */

app.get('/:username/groups', function (req, res) {
  db.groups.find({
    username: validateUsername(req.params.username)
  }, function (err, docs) {
    res.json({
      "groups": docs.map(function (entry) {
        return entry.group;
      }),
      "detail": docs
    });
  })
});

/**
 * add user to group
 */

app.post('/:username/group', function (req, res) {
  if (req.params.username) {
    db.groups.findOne({
      username: validateShort(req.params.username),
      group: validateShort(req.body.group)
    }, function (err, found) {
      if (!found) {
        db.groups.save({
          username: req.params.username,
          group: req.body.group,
        }, res.json.bind(res, {"error": false, message: '1'}));
      } else {
        res.json({"error": false, message: '2'})
      }
    });
  } else {
    res.json({error: true, message: 'Invalid add group request'}, 500);
  }
})

/**
 * delete group for user
 */

app.post('/:username/delGroup', function (req, res) {
  db.groups.remove({
    username: validateShort(req.params.username),
    group: validateLong(req.body.group)
  }, function (err) {
    res.json({"error": err})
  })
});

/**
 * create post
 */

app.post('/createPost', function (req, res) {
  if (req.body.message && req.body.reply && req.body.parentItem && req.body.date && req.body.username && req.body.lastDate) {
    id = db.ObjectId();
    db.posts.save({
      reply: req.body.reply,
      parent: req.body.parentItem,
      username: req.body.username,
      date: req.body.date,
      lastDate: req.body.lastDate,
      message: req.body.message,
      resolved: 'false',
      _id: id
    });
    if ('true'.localeCompare(req.body.reply)) {
      console.log("Hello World");
      db.posts.update(
            {_id: db.ObjectId(req.body.parentItem)},
            { $set : { lastDate: req.body.date} }
          )
    }
    res.json({error: false, postid: id});
  } else {
    res.json({error: true, message: 'Invalid post add request'}, 500);
  }
})

/**
 * get all sessions
 */

app.get('/posts', function (req, res) {
  var query = { };
  if ('q' in req.query) {
    query.posts = {$regex: ".*" + req.query.q + ".*"};
  }
  db.posts.find(query).sort({date: -1}, function (err, docs) {
    res.json({"posts": docs});
  })
});

/**
 * delete session based on id
 */

app.post('/delPost/:id', function (req, res) {
  db.posts.remove({
    _id: db.ObjectId(req.params.id)
  }, function (err) {
    res.json({"error": err})
  })
});

/**
 * delete all sessions
 */

app.del('/delAllPosts321', function (req, res) {
  db.posts.drop();
  res.json({"error": "???"})
});

/**
 * add user to session
 */

app.post('/:session/addUser', function (req, res) {
  if (req.body.username) {
        db.mySessions.update(
          {_id: db.ObjectId(req.params.session)},
          { $addToSet : { usersAttending: validateUsername(req.body.username) } }
        )
        res.json({error: false});
  } else {
    res.json({error: true, message: 'Invalid following request'}, 500);
  }
});

/**
 * remove user from session
 */

app.post('/:session/removeUser', function (req, res) {
  if (req.body.username) {
    db.mySessions.findOne({
      _id: db.ObjectId(req.params.session)
    }, function (err, found) {
      if (found) {
        var indexOfUser = found.usersAttending.indexOf(validateUsername(req.body.username));
        if (indexOfUser > -1) {
          found.usersAttending.splice(indexOfUser, 1);
          db.mySessions.update(
            {_id: db.ObjectId(req.params.session)},
            { $set : { usersAttending: found.usersAttending} }
          )
          if (found.usersAttending.length == 0) {
            db.mySessions.remove({
              _id: db.ObjectId(req.params.session)
            }, function (err) {
              console.log(err);
            })
          }
          res.json({"error": false})
        } else {
          res.json({error: true, message: 'User was not in session'}, 500);
        }
      } else {
        res.json({error: true, message: 'Invalid Session Id request'}, 500);
      } 
    })
  } else {
    res.json({error: true, message: 'Invalid following request'}, 500);
  }
});

/**
 * Launch
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on http://" + app.get('host'));
});
