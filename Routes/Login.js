const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const CovidCentre = require("../Schema/CentreModel");
const ActiveUser = require("../Schema/ActiveUser");
const jwt = require("jsonwebtoken");

const comparePassword = async (password, hash) => {
  try {
    // Compare password
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }

  // Return false if error
  return false;
};
// Find User by Email
function getUser(email) {
  return new Promise(function (resolve, reject) {
    let query = CovidCentre.find({ Email: email });
    query.exec(function (err, users) {
      if (err) {
        return reject({ err: "Error while fetching users" });
      }
      return resolve(users);
    });
  });
}
//Add active User
const AddSession = (data) => {
  return new Promise(function (resolve,reject) {
      let newSession = new ActiveUser(data);
      newSession.save(function(err){
          if(err) {
              return reject({er:'Error while saving new session of user', e: err});
          }
          return resolve(data);
      });
  })
}
router.post("/", (req, res) => {
  let body = req.body;
  getUser(body.Email)
    .then((response) => {
      comparePassword(body.Password, response[0].Password)
        .then((resp) => {
          if (resp === true) {
            let user = {Name: response[0].Name, Email:response[0].Email, Password: response[0].Password}
            const refreshToken = jwt.sign(
              user,
              process.env.JWT_REFRESH_TOKEN_SECRET
            );
            AddSession({Email:user.Email, Refresh_Token:refreshToken}).then(()=>{
              console.log("Session Started");
              res.status(200).json({ m: "Authenticed user",user: {Name: user.Name,Email:user.Email, refresh: refreshToken}});
            }).catch((err)=>{
              if (err) console.log("Session Could not Start",err);
              res.status(200).json({ m: "Single User Multiple Session",user:undefined});
            });
          } else {
            res.status(200).json({ m: "Wrong Password",user:undefined });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(200).json({ m: "Could not compare passwords",user:undefined });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ m: "No user of this email exists",user:undefined });
    });
});
module.exports = router;
