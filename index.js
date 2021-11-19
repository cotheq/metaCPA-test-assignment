require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { SERVER_PORT, MONGODB_URL } = process.env;

app.use("/api", require("./router/employees"));

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("connected to database");
    app.listen(SERVER_PORT ?? 3000, () =>
      console.log("server started on port", SERVER_PORT)
    );
  } catch (e) {
    console.log("error:", e.message);
    process.exit(1);
  }
};

startServer();
