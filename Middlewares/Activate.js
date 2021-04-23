const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ActiveUser = require("../Schema/ActiveUser");

function getUser(email) {
    return new Promise(function (resolve, reject) {
      let query = ActiveUser.find({ Email: email });
      query.exec(function (err, user) {
        if (err) {
          return reject({ err: "Error while fetching users" });
        }
        return resolve(user);
      });
    });
  }
const jwtCheck = (req,res,next)=>{
    const token= req.body.refresh;
    let decoded  = jwt.verify(token,process.env.JWT_REFRESH_TOKEN_SECRET);
    getUser(decoded.Email).then((response)=>{
      console.log("returned data", response[0]);
      next();
    }).catch((err)=>{
      console.log("Refresh token has been tampered",err);
      next('route');
      res.send(404).json({m:"Tampered integrity"});
    });
};
module.exports.jwtCheck = jwtCheck;