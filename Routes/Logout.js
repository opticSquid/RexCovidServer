const express = require("express");
const router = express.Router();
const Activate = require("../Middlewares/Activate");
const ActiveUser = require("../Schema/ActiveUser");
const endSession = (email) => {
  return new Promise ((resolve,reject)=>{
    ActiveUser.deleteOne({Email:email},(err,data)=>{
      if(err)
      {
        return reject({errror: "Error while deleting", err});
      }
      else
      {
        return resolve(data);
      }
    })
  })
}
router.post("/", [Activate.jwtCheck], (req, res) => {
  let body = req.body;
  endSession(body.Email).then((response)=>{
    if(response.deletedCount===1)
    {
      console.log("Ending user session");
      res.status(200).json({ m: "logout" });
    }
  }).catch((err)=>{
    console.log("error occoured",err);
    res.status(200).json({m: "Couldnot logout"});
  })
});
module.exports = router;
