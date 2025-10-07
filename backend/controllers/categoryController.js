const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const cloudinary = require("cloudinary");
const { default: slugify } = require("slugify");

const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});

const getAdminCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});
const createCategory = catchAsyncErrors(async (req, res, next) => {
  let imageLink = {
    public_id: null,
    url: "/book-cat.png",
  };

  // Check if image was sent
  if (req.files && req.files.image) {
    const file = req.files.image;

    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        { folder: "/book/categories" }
      );

      imageLink = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
  }

  req.body.image = imageLink;
  req.body.user = req.user?.id || "Unknown";

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

const getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({ success: true, category });
});
const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  // Handle image update if new image is provided
  if (req.files?.image) {
    // Delete old image if exists
    if (category.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        // Continue with update even if deletion fails
      }
    }

    // Upload new image
    try {
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.image.mimetype
        };base64,${req.files.image.data.toString("base64")}`,
        {
          folder: "book/categories", // Removed leading slash for consistency
        }
      );

      category.image = {
        // Directly assign to category instead of req.body
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return next(new ErrorHandler("Image upload failed", 500));
    }
  }

  // Update name and slug if name is provided
  if (req.body.name) {
    category.name = req.body.name;
    category.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Save the updated category
  await category.save();

  res.status(200).json({
    success: true,
    category,
  });
});

const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (category.image && category.image.public_id) {
    try {
      await cloudinary.uploader.destroy(category.image.public_id);
    } catch (error) {
      console.error("Cloudinary Deletion Error:", error);
    }
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getAdminCategories,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
};
