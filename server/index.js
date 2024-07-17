const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");

const router = require("./routes/index");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");

// const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiesParser());

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    message: "Server running at " + port,
  });
});
//api endpoints
app.use("/api", router);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
