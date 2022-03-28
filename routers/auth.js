const router = require("express").Router();
const authController = require("../controllers/auth");

// URL: /auth/register
// Method: POST
router.post("/register", authController.register);

// URL: /auth/login
// Method: POST
router.post("/login", authController.login);

module.exports = router;
