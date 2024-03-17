const router = require("express").Router();
const signUp = require("./signUp");
const signIn = require("./signIn");
const users = require("./users");
const ticket = require("./tickets");
router.use("/sign-in", signIn);
router.use("/sign-up", signUp);
router.use("/user", users);
router.use("/ticket", ticket)
module.exports = router;