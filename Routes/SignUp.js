require('mongoose');
const express = require("express");
const router = express.Router();
const bycrypt = require("bcrypt");
const CovidCentre = require("../Schema/CentreModel");
const ActiveUser = require("../Schema/ActiveUser");
const jwt = require('jsonwebtoken');
const hashPassword = async (body) => {
  const saltRounds = 10;
  const hashedPassword = await bycrypt.hash(body.Password, saltRounds);
  return { Name: body.Name, Email: body.Email, Password: hashedPassword };
};
//Saving to DB
const SaveUser = (data) => {
    return new Promise(function (resolve,reject) {
        let newCenter = new CovidCentre(data);
        newCenter.save(function(err){
            if(err) {
                return reject({er:'Error while saving new user', e: err});
            }
            return resolve(data);
        });
    })
}
// Start Session
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
  hashPassword(body)
    .then((response) => {
      SaveUser(response).then((savedUser)=>{
        const accessToken=jwt.sign(savedUser,process.env.JWT_ACESS_TOKEN_SECRET,{expiresIn:"900s"});
        const refreshToken = jwt.sign(savedUser,process.env.JWT_REFRESH_TOKEN_SECRET);
        AddSession({Email:savedUser.Email, Access_Token: accessToken, Refresh_Token:refreshToken}).then(()=>{
          console.log("Session Started");
          res.status(200).json({m:"User Saved & Session Started", user: {access: accessToken, refresh: refreshToken}});
        }).catch((err)=>{
          if (err) console.log("Session Could not Start");
        });
      }).catch((err)=>{
          console.log(err);
          res.status(200).json({m:"User not Saved in DB", user: null});
      });
    })
    .catch((err) => {
      if (err) {
        console.log(`on this data: ${body} \n We got\n ${err}`);
        res.status(200).json({m:"Password coluld not be hashed", user: null});
      }
    });
});

module.exports = router;
