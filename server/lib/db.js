"use strict";

const initialTweets = require("./tweets");

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/tweeter';
console.log(`Connecting to MongoDB running at ${MONGODB_URI}`);

let db;

MongoClient.connect(MONGODB_URI, (err, mongoInstance) => {
  if (err) throw err;
  console.log(`Successfully connected to DB: ${MONGODB_URI}`);
  db = mongoInstance;
})

const dbMethods = {

  saveTweet: (data) => {
    db.collection('tweets').insertOne(data);
    return true;
  },

  getTweets: (cb) => {
    db.collection('tweets').find().toArray((err, results) => {
      cb(results.sort(function(a, b) { return a.created_at - b.created_at }));
    });
  }

}

module.exports = {

  connect: (onConnect) => {

    onConnect(dbMethods);

  }

}
