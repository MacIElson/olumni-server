
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
  db = mongojs(process.env.MONGOLAB_URI || 'weachieve', ['courses','mySessions']);
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
  res.redirect('https://github.com/MaciCrowell/weAchieve-server');
})

app.get('/secret', function (req, res) {
  db.tweets.find({
    // published: true
  }).sort({date: -1}, function (err, docs) {
    console.log(docs);
    res.render('index', {
      title: 'WeAchieve',
      quotes: docs,
      user: {}
    });
  })
});

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

/**
 * get all courses
 */

app.get('/courses', function (req, res) {
  db.courses.distinct('course', function (err, names) {
    res.json({"courses": names});
  });
})

/**
 * get courses user is in 
 */

app.get('/:username/courses', function (req, res) {
  var query = {
    username: validateUsername(req.params.username)
  };
  if ('q' in req.query) {
    query.course = {$regex: new RegExp(".*" + RegExp.escape(req.query.q) + ".*", i)};
  }
  db.courses.find(query).sort({date: -1}).limit(10, function (err, docs) {
    res.json({
      "courses": docs.map(function (entry) {
        return entry.course;
      }),
    });
  })
});

/**
 * add course for user
 */

app.post('/:username/course', function (req, res) {
  if (req.body.course) {
    db.courses.save({
      course: validateTweet(req.body.course),
      username: validateUsername(req.params.username)
    }, res.json.bind(res, {"error": false}));
  } else {
    res.json({error: true, message: 'Invalid course, please specify course="...." in the body.'}, 500);
  }
})

/**
 * delete course for user
 */

app.post('/:username/delCourse', function (req, res) {
  db.courses.remove({
    username: validateUsername(req.params.username),
    course: validateTweet(req.body.course)
  }, function (err) {
    res.json({"error": err})
  })
});

/**
 * createSession
 */

app.post('/createSession', function (req, res) {
  if (req.body.course && req.body.date && req.body.startTime && req.body.endTime && req.body.place && req.body.task && req.body.user) {
    id = db.ObjectId();
    db.mySessions.save({
      course: validateTweet(req.body.course),
      task: req.body.task,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      place: req.body.place,
      usersAttending: [validateUsername(req.body.user)],
      _id: id
    });
    res.json({error: false, sessionid: id});
  } else {
    res.json({error: true, message: 'Invalid course, please specify course="...." in the body.'}, 500);
  }
})

/**
 * get all sessions
 */

app.get('/sessions', function (req, res) {
  var query = { };
  if ('q' in req.query) {
    query.mySessions = {$regex: ".*" + req.query.q + ".*"};
  }
  db.mySessions.find(query).sort({date: -1}, function (err, docs) {
    res.json({"sessions": docs});
  })
});

/**
 * delete session based on id
 */

app.post('/delSession/:id', function (req, res) {
  db.mySessions.remove({
    _id: db.ObjectId(req.params.id)
  }, function (err) {
    res.json({"error": err})
  })
});

app.del('/delSession/:id', function (req, res) {
  db.mySessions.remove({
    _id: db.ObjectId(req.params.id)
  }, function (err) {
    res.json({"error": err})
  })
});

/**
 * delete all sessions
 */

app.del('/delAllSessions321', function (req, res) {
  db.mySessions.drop();
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
