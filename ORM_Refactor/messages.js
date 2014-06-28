var db = require('db.js');
// System for storying messages

var createMessage = function (msgObj, callback) {
  msgObj.createdAt = new Date();
  msgObj.updatedAt = msgObj.createdAt;

  //insert into our database
  db.createMessage(msgObj, callback);
};

var validateMessage = function (msgObj) {
  // if((!msgObj.hasOwnProperty('roomname')) || (typeof msgObj.roomname !== 'string')) {
  //   return false;
  // }
  if((!msgObj.hasOwnProperty('username')) || (typeof msgObj.username !== 'string')) {
    return false;
  }

  return true;
};

var getMessages = function (callback){
  db.getMessages(function(dbMsgs){
    // Need to process the message results
    var processedMessages = [];
    // We expect to get objects with the following keys
    //     createdAt: "2013-10-07T16:22:03.280Z"
    //     objectId: "teDOY3Rnpe"
    //     roomname: "lobby"
    //     text: "hello"
    //     updatedAt: "2013-10-07T16:22:03.280Z"
    //     username: "gary"
    dbMsgs.forEach(function(rawMsg){
      var msg = {};
      msg.createdAt = rawMsg.dataValues.createdAt;
      msg.objectId = rawMsg.dataValues.id;
      msg.text = rawMsg.dataValues.message;
      msg.updatedAt = rawMsg.dataValues.updatedAt;
      msg.username = rawMsg.user.dataValues.username;
      msg.room = rawMsg.roomname.dataValues.roomname;
      processedMessages.push(msg);
    });
    callback({results: processedMessages});
  });
  // var result = [];

  // for(var message in msgStorage) {
  //   result.push(msgStorage[message]);
  // }

  // return {'results': result};
};

module.exports = {};
module.exports.createMessage = createMessage;
module.exports.validateMessage = validateMessage;
module.exports.getMessages = getMessages;
