const router = require("express").Router();
const UserController = require("../controllers/UserController");
// middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users/checkuser", UserController.checkUser);
router.get("/users/:id", UserController.getUserById);
router.patch(
  "/users/edit/:id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);

module.exports = router;
