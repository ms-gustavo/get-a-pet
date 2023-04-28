const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users/checkuser", UserController.checkUser);
router.get("/users/:id", UserController.getUserById);

module.exports = router;
