var spicePg = require('spiced-pg');
var secrets = require('./secrets.json');
var dbUrl = process.env.DATABASE_URL ||`postgres:${secrets.dbUser}:${secrets.password}@localhost:5432/socialnetwork`;
var db = spicePg(dbUrl);

function insertUser(name, last_name, email, hash){
  const q = `INSERT INTO users
  (first_name, last_name, email, hashpassword)
  VALUES ($1, $2, $3, $4) RETURNING id;`
  ;
  const params = [
    name,
    last_name,
    email,
    hash
  ];
  return db.query(q, params).then(function (results) {
    return results.rows[0];

  }).catch(function (err) {
    console.log("there was an error", err);
    throw err;
  });
}
function checkIfEmailExists(email) {
  const q = `SELECT email
  FROM users
  WHERE email = $1`
  ;
  return db.query(q,[email]).then(function(results){
    var exists = false;
    var data =  results.rows;
    for (var i = 0; i < data.length; i++) {
      if (data[i].email === email) {
        exists = true;
      }
    }
    return exists;
  }).catch(function (err) {
    console.log(err);
  });
}
function getPassword(email) {
  const q = `SELECT hashpassword FROM users WHERE email = '${email}'`;
  return db.query(q, []).then(function(results){
    return results.rows[0].hashpassword;
  }).catch(function (e) {
    console.log("there was an error", e);
  });
}

// <======= fn to get the require user data to build req.session.user =========>
function getUser(email) {
  const q = `SELECT *
  FROM users
  WHERE email = $1`
  ;
  return db.query(q, [email]).then(function( results) {
    return results.rows[0];
  }).catch(function(err){
    console.log(err);

  });

}
function insertImg(img_url, id){
  const q = `UPDATE users
  SET img_url = $1
  WHERE id = $2;`
  ;
  const params = [
    img_url,
    id
  ];
  return db.query(q, params).then(function (results) {
    return results.rows[0];
  }).catch(function(err){
    console.log(err);
  });
}
function editUserBio(info, id) {
  const q = `UPDATE users
  SET info = $1
  WHERE id = $2;`
  ;
  const params = [
    info,
    id
  ];
  return db.query(q, params).then(function (results) {
    return results;
  }).catch(function(err){
    console.log(err);
    throw err;
  });
}
function getUserOP(id) {

  const q = `SELECT *
  FROM users
  WHERE id = $1`
  ;
  return db.query(q, [id]).then(function(results) {

    return results.rows[0];
  }).catch(function(err){
    console.log(err);
    throw err;
  });

}
//query for the wallcontainer
function insertComment(commented_id, user_id, comments){
  const q = `INSERT INTO comments
  (commented_id, user_id, comments)
  VALUES ($1, $2, $3)`
  ;
  const params = [commented_id, user_id, comments];

  return db.query(q, params).then(function(results){
    console.log(results);
    return results.rows[0];
  }).catch(function(err){
    console.log(err);
    throw err;
  });
}
function getComments(commentedId){
  const q = `SELECT users.id, users.first_name, users.last_name, users.img_url, comments.comments
  FROM users
  JOIN comments
  ON users.id = comments.user_id WHERE comments.commented_id = $1`
  ;
  return db.query(q, [commentedId]).then(function (results) {
    return results.rows;
  }).catch(function (err) {
    console.log(err);
    throw err;
  });
}
//querys for the FriendsButton
function getFrienshipStatus(id, user_id) {
  const q = `SELECT recipient_id, sender_id, status
  FROM friends
  WHERE (recipient_id = $1 OR sender_id = $1)
  AND (recipient_id = $2 OR sender_id = $2);`
  ;
  const params = [id, user_id];
  return db.query(q, params).then(function(results){
    return results.rows[0] || null;

  }).catch(function(err){
    console.log(err);
    throw err;
  });
}
function insertFriend(id, userId) {
  const q = `INSERT INTO friends
  (sender_id, recipient_id,  status)
  VALUES ($1, $2, $3)
  RETURNING status;`
  ;
  const params=[id, userId, "pending"];
  return db.query(q, params).then(function (results) {
    return results.rows[0];
  }).catch(function (err) {
    console.log(err);
    throw err;
  })
}

function acceptFriendRequest(id, userId) {
  const q = `UPDATE friends
  SET status = $3, updated_at = CURRENT_TIMESTAMP
  WHERE (recipient_id= $2 OR sender_id= $1)
  RETURNING status;`
  ;

  const params =[id, userId, "accepted"];
  return db.query(q, params).then(function(results){
    return results.rows[0];
  }).catch(function(err){
    console.log(err);
    throw err;
  });
}

function cancelFriendRequest(id, userId) {
  const q = `UPDATE friends
  SET status =$3
  WHERE (recipient_id= $1 OR sender_id= $2)
  RETURNING status;`
  ;
  const params = [id, userId, "cancelled"];
  return db.query(q, params).then(function(results){
    return results.rows[0];
  }).catch(function(err){
    console.log(err);
    throw err;
  });
}
function eliminateFriend(id, userId){
  const q =`UPDATE friend_requests
  SET status = $3, updated_at = CURRENT_TIMESTAMP
  WHERE (recipient_id = $2 AND sender_id = $1)
  RETURNING status;`
  ;
  const params =[id, userId, "terminated"];
  return db.query(q, params).then(function (results) {
    return results.rows[0];
  }).catch(function (err) {
    console.log(err);
    throw err;
  });
}
// <======= query for page friends ========>
function getAllFriends(id){
  const q = `SELECT users.id, users.first_name, users.last_name, users.img_url, friends.recipient_id, friends.sender_id, friends.status
  FROM users JOIN friends
  ON (users.id = friends.recipient_id AND friends.recipient_id <> $1)
  OR (users.id = friends.sender_id AND friends.sender_id <> $1)
  WHERE (friends.recipient_id = $1 OR friends.sender_id = $1)
  AND (friends.status = 'accepted');`
  ;
  const params = [ id ];
  return db.query(q, params).then(function(results){
    return results.rows;
  }).catch(function(err){
    console.log(err);
    throw err;
  });
}
function getPendingRequests(id) {
  const q = `SELECT users.id, friends.recipient_id, friends.sender_id, friends.status, users.first_name, users.last_name, users.img_url
  FROM friends JOIN users ON friends.sender_id = users.id
  WHERE (friends.recipient_id = $1) AND (friends.status = 'pending');`;
  const params = [ id ];
  return db.query(q, params).then(function(results) {
    return results.rows;
  }).catch(function(err) {
    throw err;
  });
}
// <======== query socket.io =========>
function getOnlineUsers(onlineUsers){
  var newArray = [];
  onlineUsers.forEach(function(currentValue, index){
    newArray.push(currentValue["userId"]);
  });
  const q = `SELECT id, first_name, last_name, img_url
  FROM users
  WHERE id = ANY ($1);`
  ;
  const params = [newArray];
    return db.query(q, params).then(function(results){
      console.log(results.rows, "this are the results in getonlineuser");
      return results.rows;
    }).catch(function(err){
      console.log("there was an error in getOnlineUsers", err);
      throw err;
    });
}
exports.insertUser = insertUser;
exports.checkIfEmailExists = checkIfEmailExists;
exports.getPassword = getPassword;
exports.getUser = getUser;
exports.insertImg = insertImg;
exports.editUserBio = editUserBio;
exports.getUserOP = getUserOP;
exports.insertComment = insertComment;
exports.getComments = getComments;
exports.getFrienshipStatus = getFrienshipStatus;
exports.insertFriend  = insertFriend;
exports.acceptFriendRequest = acceptFriendRequest;
exports.cancelFriendRequest = cancelFriendRequest;
exports.eliminateFriend = eliminateFriend;
exports.getAllFriends= getAllFriends;
exports.getPendingRequests = getPendingRequests;
exports.getOnlineUsers = getOnlineUsers;
