const express = require("express");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const {
  getAllCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
} = require("../controllers/categoryController");

const router = express.Router();
router.get("/categories", getAllCategories);
router.get(
  "/admin/categories",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminCategories
);
router.post(
  "/admin/category/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createCategory
);
router
  .route("/admin/category/:id")
  .put(isAuthenticator, authorizeRoles("admin"), updateCategory)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteCategory);
router.get("/category/:id", getCategoryDetails);
module.exports = router;
