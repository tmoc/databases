var db = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = db.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/


module.exports.createMessage = function(msgObj, callback){
  //to create a message we need to make sure we have a user in the user table.
  checkUser(msgObj, callback);
};

var checkUser = function(msgObj, callback){
  dbConnection.query('select id from users where username = ?',[msgObj.username], function(error, result){
    if (error) throw error;
    if(result[0] && result[0].id){
      msgObj.userid = result[0].id;
      //we have the user in the DB. Now to check if the room exisits
      createRoom(msgObj, callback);
    } else {
      //We need to create the user first
      createUser(msgObj, callback);
    }
  });

};

var createUser = function(msgObj, callback){
  dbConnection.query('insert into users (username) values (?)', [msgObj.username], function(error, result){
    if (error) throw error;
    //We've created our user and expect the db to have created the userId
    msgObj.userid = result.insertId;
    //we have the user in the DB. Now to check if the room exisits
    createRoom(msgObj, callback);
  });
};

var checkRoom = function(msgObj, callback){
  dbConnection.query('select id from rooms where roomname = ?',[msgObj.roomname], function(error, result){
    if (error) throw error;
    if(result[0] && result[0].id){
      msgObj.roomid = result[0].id;
      //we have the user in the DB. Now we can create the message record.
      createMessageRow(msgObj, callback);
    } else {
      //We need to create the room first
      createRoom(msgObj, callback);
    }
  });
};

var createRoom = function(msgObj, callback){
  dbConnection.query('insert into rooms (roomname) values (?)', [msgObj.roomname], function(error, result){
    if (error) throw error;
    //We've created our room and expect the db to have created the roomId
    msgObj.roomid = result.insertId;
    //we have the user in the DB. Now we can create the message record.
    createMessageRow(msgObj, callback);
  });

};

var createMessageRow = function(msgObj, callback){

  dbConnection.query('insert into messages (message, user_id, room_id, createdat, updatedat) values (?, ?, ?, ?, ?)',
    [msgObj.text, msgObj.userid, msgObj.roomid, msgObj.createdAt, msgObj.updatedAt],
    function(error, result){
      if (error) throw error;
      //Finally our message is created. We can finally callback to the creator.
      callback();
    });
};
