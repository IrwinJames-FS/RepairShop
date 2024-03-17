const router = require("express").Router();
const signUp = require("./signUp");
const signIn = require("./signIn");
const users = require("./users");
router.use("/sign-in", signIn);
router.use("/sign-up", signUp);
router.use("/user", users);
module.exports = router;