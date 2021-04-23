const express = require("express");
const router = express.Router();
const CentreDetail = require("../Schema/CentreDetailsModel");
const Activate = require("../Middlewares/Activate");

// const SaveCentreDetail = (data) => {
//     return new Promise(function (resolve, reject) {
//       let newCenter = new CentreDetail(data);
//       newCenter.save(function (err) {
//         if (err) {
//           return reject({ er: "Error while saving new user", e: err });
//         }
//         return resolve(data);
//       });
//     });
//   };
const SaveCentreDetail = async(data) => {
  const doc = await CentreDetail.findOneAndUpdate(
    { Email: data.Email },
    { $set: data },
    { upsert: true, new: true, useFindAndModify:false}
  );
  return doc;
}
router.post("/", [Activate.jwtCheck] ,(req, res) => {
    const body = req.body;
    console.log(body);
    SaveCentreDetail(body).then((response)=>{
        console.log("response after saving",response);
    }).catch((err)=>{
        console.log("Got an error=> ",err);
    });
    res.status(200).json({m:"ok"});
});
module.exports = router;
