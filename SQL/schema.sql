CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  id INT NOT NULL auto_increment,
  user_id INT,
  room_id INT,
  message TEXT,
  createdat DATETIME,
  updatedat DATETIME,
  PRIMARY KEY(id)

);

CREATE TABLE users (
  id INT NOT NULL auto_increment,
  username varchar(255),
  PRIMARY KEY(id)
);

CREATE TABLE rooms (
  id INT NOT NULL auto_increment,
  roomname varchar(255),
  PRIMARY KEY(id)
);

ALTER TABLE MESSAGES
ADD FOREIGN KEY (user_id)
REFERENCES users(id);

ALTER TABLE MESSAGES
ADD FOREIGN KEY (room_id)
REFERENCES rooms(id);

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




