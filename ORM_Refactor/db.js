var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "");

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('User', {
  username: Sequelize.STRING
},{
  tableName: 'users'
});

var Room = sequelize.define('Room', {
  roomname: Sequelize.STRING
},{
  tableName: 'rooms'
});

var Message = sequelize.define('Message', {
  'user_id': Sequelize.INTEGER,
  message: Sequelize.STRING,
  'room_id': Sequelize.INTEGER
},{
  tableName: 'messages'
});

Message.belongsTo(Room, {foreignKey: 'room_id'});
Message.belongsTo(User, {foreignKey: 'user_id'});

User.sync();
Room.sync();
Message.sync();


/* Finished setup of ORM connections */

module.exports.getMessages = function(callback){
  Message.findAll({order: 'createdAt DESC', include: [User, Room]})
  .success(function(messages){
    callback(messages);
  });
};

module.exports.createMessage = function(msgObj, callback){
  //Kick off the chain of events to create User, Room, and finally Message.
  //Starts with user.
  findOrCreateUser(msgObj, callback);
};

var findOrCreateUser = function(msgObj, callback){
  User.findOrCreate({username: msgObj.username})
  .success(function(user, created){
    // User handled, move on to getting or creating the room.
    findOrCreateRoom(msgObj, user, callback);
  });
};

var findOrCreateRoom = function(msgObj, user, callback){
  Room.findOrCreate({roomname: msgObj.roomname}).success(function(room, created){
    // Room handled, move on to creating the message.
    createMessageRow(msgObj, user, room, callback);
  });
};

var createMessageRow = function(msgObj, user, room, callback){
  Message.create({ message: msgObj.text, user_id: user.dataValues.id, room_id: room.dataValues.id})
  .complete(function(err, message){
    if (err) throw err;
    //Message successfully added to the database.
    callback();
  });
};
