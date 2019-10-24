//Initial Setups
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./enye-firebase.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://enye-firebase-4d29f.firebaseio.com"
});
const app = express();
app.use(cors());

//GET users request
app.get("/", (request, response) => {
  return admin
    .database()
    .ref("/users")
    .on(
      "value",
      snapshot => {
        return response.status(200).send(snapshot.val());
      },
      error => {
        console.error(error);
        return response.status(500).send("Something went wrong" + error);
      }
    );
});

//POST user
app.post("/", (request, response) => {
  const newUser = request.body;
  return admin
    .database()
    .ref("/users")
    .push(newUser)
    .then(() => {
      return response.status(200).send(newUser);
    })
    .catch(error => {
      console.error(error);
      return response
        .status(500)
        .send("Something went wrong, Please try again " + error);
    });
});

exports.users = functions.https.onRequest(app);
