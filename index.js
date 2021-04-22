require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//Requiring models
require("./Schema/CentreModel");
require("./Schema/ActiveUser");
// Heroku sets process.env.NODE_ENV="production"

const dev_config = {
  origin: "http://localhost:3000",
};
const prod_config = {
  origin: "https://rex-covid-assistance.netlify.app/",
};
// Initializing Express
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(process.env.NODE_ENV === "production" ? prod_config : dev_config));
// Port variable
const port = process.env.PORT || 5000;
// API endpoints after connecting to database
mongoose
  .connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.get("/", (req, res) => {
      res.status(200).json({ m: "hello from backend" });
    });
    app.use("/centres", require("./Routes/centreLocations"));
    app.use("/signup", require("./Routes/SignUp"));
    app.use("/login", require("./Routes/Login"));
  })
  .catch((error) => {
    if (error) throw error;
  });
app.listen(port, () => console.log(`Server Running on port ${port}`));
