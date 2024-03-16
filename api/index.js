const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const initialize = require("./initializer");
require("dotenv").config();




const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", error=>console.error(error));
db.once("open", ()=>initialize());
const app = express();

//Configure the app
app.use(cors());
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));