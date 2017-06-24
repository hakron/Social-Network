const auth = require('./sql/utilities');
const db = require('./sql/db');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const multer = require('multer');
const diskStorage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, __dirname + '/uploads');
  },
  filename: function (req, file, callback){
    callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
  }
});
const uploader = multer({
  storage: diskStorage,
  limits: {
    filesize: 2097152
  }
});
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8080;
let onlineUsers = [];
if (process.env.NODE_ENV != 'production') {
  app.use(require('./build'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  secret: " give me a donner",
  maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(csurf());
app.use(function(req, res, next){
  res.cookie('t', req.csrfToken());
  next();
});

app.use("/static", express.static(__dirname+"/public"));
app.use("/uploads", express.static(__dirname+ "/uploads"));

//register a new user
app.post('/registerNewUser', function(req, res) {
  if (!req.body.name || !req.body.lastname || !req.body.email || !req.body.password){
    res.json({
      success:false
    });

  } else {
    auth.hashPassword(req.body.password).then(function(hash){
      return db.insertUser(req.body.name, req.body.lastname, req.body.email, hash).then(function(results){
        req.session.user = {
          id : results.id,
          name : req.body.name,
          lastname : req.body.lastname,
          email : req.body.email
        };
        res.json({
          success:true
        })
      }).then(function() {
      }).catch(function(err){
        console.log(err);
        res.json({
          success: false,
          notUnique: "not unique"
        })
      });
    }).catch(function (err) {
      console.log(err);
    });
  }
});
//login a user already in the data base
app.post('/loginUser', function(req, res){
  if (!req.body.email || !req.body.password){
    res.json({
      success:false,
    });

  } else {
    db.checkIfEmailExists(req.body.email).then(function(exists){
      if(!exists){
        res.json({
          success:false,
          notExists: "not exists"
        });
      } else {
        db.getPassword(req.body.email).then(function(results){
          auth.checkPassword(req.body.password, results).then(function(doesMatch){
            if (doesMatch == true){
              db.getUser(req.body.email)
              .then(function(results){
                //data from the database
                req.session.user={
                  id : results.id,
                  firstName : results.first_name,
                  lastName : results.last_name,
                  email : req.body.email,
                  profilePicUrl: results.img_url,
                  bio: results.info
                };
                // return req.session.user;
                res.json({
                  userInfo: req.session.user,
                  success: true
                });
              });
            } else {
              res.json({
                success:false,
                error: "wrong pwd"
              });
            }
          });
        });
      }
    });
  }
});
//change the default profile pic for one of the user
app.post('/userInsertProfilePic', requireUser, uploader.single('file'), function(req, res){
  if (req.file) {
    db.insertImg("/uploads/" + req.file.filename, req.session.user.id).then(function(results){
      res.json({
        success:true,
        file: "/uploads/" + req.file.filename
      });
    }).catch(function (err) {
      console.log(err);
    });

  } else {
    res.json({
      success: false,
    });
  }
});
//get the user data from the data base to create the user profile
app.get('/userProfileInfo', requireUser, function (req, res) {
  //data from req.session.user
  const userInfo = {
    id: req.session.user.id,
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    profilePicUrl: req.session.user.profilePicUrl
  };
  res.json({
    succes: true,
    results:userInfo
  });
});
//edit the bio from the user
app.post('/editUserBio', requireUser, function (req, res) {
  db.editUserBio(req.body.bio, req.session.user.id).then(function(results){
    res.json({
      success:true,
      bio: req.body.bio
    });
  }).catch(function(err){
    console.log(err);
  });
});
//get the bio from the user and render it in the user profile
app.get('/userBio', requireUser,function (req, res) {
  const userInfo = {
    bio: req.session.user.bio
  };
  res.json({
    succes: true,
    results:userInfo
  });
});
//get the data from another user and show it another profile page meanwhile you are logged
app.get('/user/:id/data', requireUser, function(req, res){
  if (req.params.id == req.session.user.id) {
    res.json({
      redirect: true
    });
    return;
  }else{
    req.params.id != req.session.user.id;
  }

  db.getUserOP(req.params.id).then(function(results){
    const userInfo = {
      id: results.id,
      firstName: results.first_name,
      lastName: results.last_name,
      profilePicUrl: results.img_url,
      bio: results.info
    };
    res.json({
      success: true,
      results:userInfo
    });
  });
});
//insert a comment in the user profile or in another user profile
app.post('/insertComment/:commentedId', requireUser, function(req, res){
  var profileThatWasCommented;
  if(req.params.commentedId === "undefined"){
    profileThatWasCommented = req.session.user.id;
  } else {
    profileThatWasCommented = req.params.commentedId;
  }
  // console.log(profileThatWasCommented, "this is the commentedId");
  db.insertComment(profileThatWasCommented, req.session.user.id, req.body.comment).then(function(results){
    res.json({
      success:true,
      comment: req.body.comment
    });
  }).catch(function(err){
    console.log(err);
  });
});
//get the comments from the data base and render it in the user profile who you are watching with the info of the user who posted the comment
app.get('/getUserComment/:commentedId/comments', requireUser, function(req, res){
  var profileThatWasCommented;
  if(req.params.commentedId === "undefined"){
    profileThatWasCommented = req.session.user.id;
  } else {
    profileThatWasCommented = req.params.commentedId;
  }
  db.getComments(profileThatWasCommented).then(function (comments) {
    res.json({
      success: true,
      comments: comments
    });
  });
});

//friend button, work in progress, not so much progress
app.get('/getFrienshipStatus/:friendId/friendship', requireUser, function(req, res){
  var otherUserId =req.params.friendId;
  db.getFrienshipStatus(req.session.user.id, otherUserId).then(function(results){
    res.json({ friendshipStatusInfo: results});
  }).catch(function(err){
    console.log(err);
    res.json({ err: true });
  });
});
app.post('/userAddFriend/:friendId/addFriends', requireUser, function(req, res){
  var otherUserId = req.params.friendId;
  db.insertFriend(req.session.user.id, otherUserId).then(function(results){
    res.json({status: results.status});
  }).catch(function(err){
    console.log(err);
    res.json({error: true});
  });
});
app.post('/userAcceptFriend/:friendId/acceptFriendship', requireUser, function(req, res){
  var otherUserId = req.params.friendId;
  db.acceptFriendRequest(req.session.user.id, otherUserId).then(function(results){
    res.json({status: results.status});
  }).catch(function(err){
    console.log(err);
    res.json({error: true});
  });
});
app.post('/userEndFriendship/:friendId/endFriendship', requireUser, function(req, res){
  var otherUserId =req.params.friendId;
  db.eliminateFriend(req.session.user.id, otherUserId).then(function(results){
    res.json({status:results.status});
  }).catch(function(err){
    console.log(err);
    res.json({error: true});
  });
});
// <============== end friend button =============>
// <========= friends page ============>
app.get('/getAllFriendsAndPendingRequest', requireUser, function (req, res) {
  Promise.all ([
    db.getAllFriends(req.session.user.id),
    db.getPendingRequests(req.session.user.id),
  ]).then((data) => {
    res.json({
      succes:true,
      friends: data[0],
      requests: data[1]
    });
  }).catch((err) =>{
    res.json({
      succes:false
    });
  });
});
// <========= get online users ============>
app.get('/welcome', function(req, res){
  if (req.session.user){
    res.redirect('/');
  }
  res.sendFile(__dirname + '/index.html');
});
app.get('/logout', function(req, res){
  req.session = null;
    res.redirect('/welcome#/login');
});

app.get('/connected/:socketId', (req, res) => {
  if(req.session.user){
      io.sockets.sockets[req.params.socketId] && onlineUsers.push({
        socketId: req.params.socketId,
        userId: req.session.user.id
      });
  } else {
    res.json({ onlineUsers: onlineUsers });
  }
});

app.get('/onlineUsers', requireUser, function(req, res){
if(onlineUsers.length > 0){
  db.getOnlineUsers(onlineUsers).then((data)=>{
    console.log(data,"this is the data");
    res.json({ success: true, onlineUsersInfo: data});
  }).catch((err) => {
    res.json({success:false});
  });
  } else {
    res.json({msg: "no users online"});
  }

});
app.get('/', requireUser, function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('*', function(req, res) {
  if(!req.session.user){
    return res.redirect('/welcome');
  }
  res.sendFile(__dirname + '/index.html');
});
server.listen(port, function() {
  console.log("Hi there",port);
});
//change app in listen to server
io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    socket.on('disconnect', function() {
        for (var i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].socketId == socket.id) {
                onlineUsers.splice(onlineUsers[i], 1);
            }
        }
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

});
function requireUser(req, res, next){
  if(req.session.user){
    return next();
  }
  res.redirect('/welcome');
}
