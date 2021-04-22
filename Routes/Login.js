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
            const accessToken = jwt.sign(
              user,
              process.env.JWT_ACESS_TOKEN_SECRET,
              { expiresIn: "900s" }
            );
            const refreshToken = jwt.sign(
              user,
              process.env.JWT_REFRESH_TOKEN_SECRET
            );
            AddSession({Email:user.Email, Access_Token: accessToken, Refresh_Token:refreshToken}).then(()=>{
              console.log("Session Started");
              res.status(200).json({ m: "Authenticed user",user: {access: accessToken, refresh: refreshToken} });
            }).catch((err)=>{
              if (err) console.log("Session Could not Start");
            });
          } else {
            res.status(200).json({ m: "Wrong Password" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(200).json({ m: "Could not compare passwords" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ m: "No user of this email exists" });
    });
});
module.exports = router;
