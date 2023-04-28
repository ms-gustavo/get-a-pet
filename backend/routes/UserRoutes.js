const router = require("express").Router();
const UserController = require("../controllers/UserController");
// middlewares
const verifyToken = require("../helpers/verify-token");

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users/checkuser", UserController.checkUser);
router.get("/users/:id", UserController.getUserById);
router.patch("/users/edit/:id", verifyToken, UserController.editUser);

module.exports = router;
