const { urlencoded } = require("express");
const express = require("express");
//const cors = require("cors");
const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.status(200).json({ m: "hello from backend" });
});
app.listen(port, () => console.log(`Server Running on port ${port}`));
