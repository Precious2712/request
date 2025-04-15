const express = require("express");
const route = express.Router();

const {
    signupUser,
    loginUsers,
    forgotPassword,
    resetPassword,
    checkCurrentUser
} = require("../controller/auth");

const verifyUser = require('../middleware/verifyCurrentUser');

route.post("/signup",
    signupUser
);

route.post('/login',
    loginUsers
);

route.post(
    '/forgot-password',
    forgotPassword
)

route.post(
    '/resetPassword',
    resetPassword
)

route.get(
    '/currentuser',
    verifyUser,
    checkCurrentUser
)

module.exports = route;