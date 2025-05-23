const { readdirSync } = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//fileUpload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes Middleware
readdirSync("./src/routes").map((r) =>
  app.use("/api/v1", require(`./src/routes/${r}`))
);

//Rate Limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 100, max: 3000 });
app.use(limiter);

// Undefine Route
app.use("*", (req, res) => {
  res.status(400).json({ status: "Not Found" });
});

// DataBase Connection
const port = process.env.PORT || 5656;
// mongoose.set("strictQuery", false)
mongoose
  .connect(
    "mongodb+srv://jafor:jafor653@cluster0.gz3yibp.mongodb.net/boighor?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`app is running northsouth on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
