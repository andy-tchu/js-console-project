const mongoose = require("mongoose");
require('dotenv').config();

mongoose
  .connect(
    process.env.DB_CONN
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose;
