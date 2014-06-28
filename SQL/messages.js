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

var getMessages = function (){
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
