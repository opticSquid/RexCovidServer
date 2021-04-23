const router = require("express").Router();
const jwt = require("jsonwebtoken");
const CovidCentre = require("../Schema/CentreModel");
const ActiveUser = require("../Schema/ActiveUser");
const decodedUser = (token) => {
    let decoded  = jwt.verify(token,process.env.JWT_REFRESH_TOKEN_SECRET);
    return decoded;
};
function isActive(email) {
    return new Promise(function (resolve, reject) {
        let query = ActiveUser.find({ Email: email });
        query.exec(function (err, users) {
          if (err) {
            return reject({ err: "Error while fetching active users" });
          }
          return resolve(users);
        });
      });
}
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
router.post("/", (req, res) => {
    let body = req.body;
    console.log("Body that came",body);
    let decoded = decodedUser(body.token);
    console.log("decoded User", decoded);
    isActive(decoded.Email).then((activeSession)=>{
        console.log("Active session",activeSession);
        getUser(activeSession[0].Email).then((response)=>{
            console.log("Got User",response);
            res.status(200).json({ m: "Authenticed user",user: {Name: response[0].Name,Email:response[0].Email, refresh: body.token}});
        }).catch((err)=>{
            console.log("Error while fetching existing user",err);
            res.status(200).json({ m: "User doesn't exist",user:undefined});
        });
    }).catch((err)=>{
        console.log("Error while fetching existing session",err);
        res.status(200).json({ m: "User not loggd in",user:undefined});
    });
});
module.exports = router;
