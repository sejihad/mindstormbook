const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogDetails,
  updateBlog,
  deleteBlog,
  getAdminBlogDetails,
} = require("../controllers/blogController");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.get("/blogs", getAllBlogs);
router.get(
  "/admin/blogs",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminBlogs
);
router.post(
  "/admin/blog/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createBlog
);

router
  .route("/admin/blog/:id")
  .get(isAuthenticator, authorizeRoles("admin"), getAdminBlogDetails)
  .put(isAuthenticator, authorizeRoles("admin"), updateBlog)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteBlog);
router.get("/blog/:slug", getBlogDetails);

module.exports = router;
