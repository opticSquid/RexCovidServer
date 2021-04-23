const router = require("express").Router();
const Activate = require("../Middlewares/Activate");
const CentreDetails = require("../Schema/CentreDetailsModel");
const jwt = require("jsonwebtoken");
const decodedUser = (token) => {
  let decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
  return decoded;
};
function getCenterDetails(email) {
  return new Promise(function (resolve, reject) {
    let query = CentreDetails.find({ Email: email });
    query.exec(function (err, users) {
      if (err) {
        return reject({ err: "Error while fetching Centre Details" });
      }
      return resolve(users);
    });
  });
}
router.get("/", [Activate.jwtCheck], (req, res) => {
  let headers = req.headers;
  let user = decodedUser(headers.refreshtoken);
  console.log("user", user);
  getCenterDetails(user.Email)
    .then((response) => {
      console.log("response", response[0]);
      res.status(200).json({m: "Details found", Details: response[0]});
    })
    .catch((err) => {
      console.log("Could not get centre details", err);
    });
});
module.exports = router;
