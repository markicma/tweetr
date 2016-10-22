"use strict";

const initialTweets = require("./tweets");

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/tweeter';
console.log(`Connecting to MongoDB running at ${MONGODB_URI}`);

// This variable is used to initialize the database variable
let db;

// Connecting to the mongo database and then set the database instance to the
// previously initialized db variable.
MongoClient.connect(MONGODB_URI, (err, mongoInstance) => {
  if (err) throw err;
  console.log(`Successfully connected to DB: ${MONGODB_URI}`);
  db = mongoInstance;
})

const dbMethods = {

  // Each time this function is called, the insertOne function inserts the data
  // into the mongo database collection named tweets.
  saveTweet: (data) => {
    db.collection('tweets').insertOne(data);
    return true;
  },

  // Each time this function is called, the data in the database collection tweets
  // is found and turned into an array, within this function the callback calls
  // the callback from the getTweets parameter and uses the chronologically sorted
  // array of data.
  getTweets: (cb) => {
    db.collection('tweets').find().toArray((err, results) => {
      if (err) throw err;
      cb(results.sort(function(a, b) { return a.created_at - b.created_at }));
    });
  }

}

module.exports = {

  connect: (onConnect) => {

    onConnect(dbMethods);

  }

}
