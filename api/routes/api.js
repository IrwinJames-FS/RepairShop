const router = require("express").Router();
const signIn = require("./signIn");
const users = require("./users");
router.use("/sign-in", signIn);
router.use("/user", users);
module.exports = router;