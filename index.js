const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const initialize = require("./initializer");
const api = require("./routes/api");
const cookieParser = require("cookie-parser");
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
//server static files... not yet
app.use(express.json()); 
app.use(cookieParser())
//app.use(morgan("dev"));
app.use("/api", api);
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));