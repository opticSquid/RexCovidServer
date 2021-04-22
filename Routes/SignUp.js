require('mongoose');
const express = require("express");
const router = express.Router();
const bycrypt = require("bcrypt");
const CovidCentre = require("../Schema/CentreModel");
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
router.post("/", (req, res) => {
  let body = req.body;
  hashPassword(body)
    .then((response) => {
      SaveUser(response).then((r)=>{
        const accessToken=jwt.sign(r,process.env.JWT_ACESS_TOKEN_SECRET,{expiresIn:"900s"});
        const refreshToken = jwt.sign(r,process.env.JWT_REFRESH_TOKEN_SECRET);
          res.status(200).json({m:"User Saved", user: {access: accessToken, refresh: refreshToken}});
      }).catch((err)=>{
          console.log(err);
          res.status(200).json({m:"User not Saved", user: null});
      });
    })
    .catch((err) => {
      if (err) {
        console.log(`on this data: ${body} \n We got\n ${err}`);
        res.status(200).json({m:"User not Saved", user: null});
      }
    });
});

module.exports = router;
