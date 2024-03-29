const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const initialize = require("./initializer");
const api = require("./routes/api");
const cookieParser = require("cookie-parser");
const { ApiError } = require("./errors");
require("dotenv").config({path: '../.env'});




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
app.use("/api/v1", api);

app.use(express.static(path.join(__dirname, '../bench/build')));

app.use("/*", (req, res) => {
	res.sendFile(path.join(__dirname, '../bench/build', 'index.html'));
});

//handle errors
app.use((err, req, res, next) => {
	if(err instanceof ApiError) return res.status(err.status).json(err.json);
	return next(err.message);
});
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));