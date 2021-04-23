const express = require("express");
const router = express.Router();
const CentreDetail = require("../Schema/CentreDetailsModel");
function getNearbyCentres(location, raduis) {
  return new Promise(function (resolve, reject) {
    let query = CentreDetail.find({
      Location: {
        $near: {
          $geometry: location,
          $maxDistance: parseInt(raduis) * 1000,
          $minDistance: 0,
        },
      },
    });
    query.exec(function (err, user) {
      if (err) {
        return reject({ err: "Error while fetching centres" });
      }
      return resolve(user);
    });
  });
}
router.post("/", (req, res) => {
  let body = req.body;
  console.log("Data that came", body);
  getNearbyCentres(body.MyLocation, body.Radius)
    .then((response) => {
      console.log("Got this=>\n", response);
      res.status(200).json({ m: "success", centresFound: response });
    })
    .catch((err) => {
      console.log("Got error =>", err);
      res.status(200).json({ m: "Some error occoured while finding", centresFound: [] });
    });
});

module.exports = router;
