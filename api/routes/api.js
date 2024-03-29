const router = require("express").Router();
const passport = require('passport');
const passportService = require('../services/passport');
const { signup, signin } = require('../controllers/authentication');
const users = require("./users");
const ticket = require("./tickets");
const handleLogin = passport.authenticate('local', {session:false});

const protectedRoute = passport.authenticate('jwt', {session: false});
console.log(signup);
router.use("/sign-in", handleLogin, signin);
router.use("/sign-up", signup);
router.use("/user", protectedRoute, users);
router.use("/ticket", protectedRoute, ticket)
module.exports = router;