const router = require("express").Router();
const {
  createUser,
  getAllUsers,
  getSingleUser,
  saveShow,
  getShow,
  updateShow,
  deleteShow,
  login,
} = require("../../controllers/user-controller");

// import middleware
const { authMiddleware } = require("../../utils/auth");

router
  .route("/")
  .get(getAllUsers)
  .post(createUser)
  .put(authMiddleware, saveShow);

router.route("/login").post(login);

router.route("/me").get(authMiddleware, getSingleUser);

router.route("/:username").get(getSingleUser);

router.route("/shows/:id").get(authMiddleware, getShow);

router.route("/shows/:id").put(authMiddleware, updateShow);

router.route("/shows/:id").delete(authMiddleware, deleteShow);

module.exports = router;
