'use strict';

var express = require('express');
var app = express();
var path = require('path');

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("firebase-admin-config.json"),
  databaseURL: "https://firebeargaeflex.firebaseio.com"
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/verify', function(req, res) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
    } else {
        res.send(403);
    }
    admin.auth().verifyIdToken(bearerToken)
      .then(function(decodedToken) {
	var uid = decodedToken.uid;
	  console.log("logged in uid: " + uid);
	  res.send(200);
      }).catch(function(error) {
	  // Handle error
	  console.log("logged in error");
	  res.send(403);
      });    
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
