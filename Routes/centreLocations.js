const express = require("express");
const router = express.Router();
const readBody = (req, res, next) => {
  let body = req.body;
  console.log("body", body);
  next();
};
let middlewares = [readBody];
router.post(
  "/",
  express.json(),
  express.urlencoded({ extended: true }),
  middlewares,
  (req, res) => {
    res.status(200).json({ m: 'success' });
  }
);

module.exports = router;
