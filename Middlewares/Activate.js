const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ActiveUser = require("../Schema/ActiveUser");

function getUser(email) {
    return new Promise(function (resolve, reject) {
      let query = ActiveUser.find({ Email: Email });
      query.exec(function (err, users) {
        if (err) {
          return reject({ err: "Error while fetching users" });
        }
        return resolve(users);
      });
    });
  }
const jwtCheck = (req,res,next)=>{
    const token= req.body;
    let decoded  = jwt.verify(token,process.env.JWT_REFRESH_TOKEN_SECRET);
    console.log(decoded);
    next();
};
module.exports.jwtCheck = jwtCheck;